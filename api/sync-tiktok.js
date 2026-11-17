// Vercel Serverless Function: api/sync-tiktok.js
// Lấy số liệu công khai từ TikTok @thuyvy.risetoshine và lưu vào Supabase

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vmksmalbkveanjnqqivr.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta3NtYWxia3ZlYW5qbnFxaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MjY3MTUsImV4cCI6MjExMDUwMjcxNX0.m2rBmq_oAjbz6uQ6Fpzqis3ROKpSRvXlYs7Svj_Ngh0';

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const handle = req.query?.handle || 'thuyvy.risetoshine';
  const targetUrl = `https://www.tiktok.com/@${handle}`;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. Thử fetch HTML công khai với Browser User-Agent
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      }
    });

    const html = await response.text();

    // 2. Tìm khối __UNIVERSAL_DATA_FOR_REHYDRATION__
    let rehydrationData = null;
    const rehydMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (rehydMatch && rehydMatch[1]) {
      try {
        rehydrationData = JSON.parse(rehydMatch[1]);
      } catch (e) {
        console.warn('Lỗi parse __UNIVERSAL_DATA_FOR_REHYDRATION__:', e);
      }
    }

    // 3. Tìm khối SIGI_STATE
    let sigiState = null;
    const sigiMatch = html.match(/<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/);
    if (sigiMatch && sigiMatch[1]) {
      try {
        sigiState = JSON.parse(sigiMatch[1]);
      } catch (e) {
        console.warn('Lỗi parse SIGI_STATE:', e);
      }
    }

    let userInfo = null;
    let videoItems = [];

    const defaultScope = rehydrationData?.__DEFAULT_SCOPE__;
    const userDetail = defaultScope?.['webapp.user-detail'];

    if (userDetail?.userInfo) {
      userInfo = userDetail.userInfo;
      const itemList = userDetail?.itemList || [];
      const itemModule = defaultScope?.['webapp.user-detail']?.itemModule || {};
      videoItems = itemList.map(id => itemModule[id]).filter(Boolean);
    } else if (sigiState?.UserModule?.users) {
      const users = sigiState.UserModule.users;
      const username = Object.keys(users)[0];
      if (username) {
        userInfo = {
          user: users[username],
          stats: sigiState?.UserModule?.stats?.[username]
        };
      }
      videoItems = Object.values(sigiState?.ItemModule || {});
    }

    // Nếu bóc tách thành công từ server
    if (userInfo?.stats) {
      const stats = userInfo.stats;
      const followerCount = Number(stats.followerCount) || 0;
      const heartCount = Number(stats.heartCount) || 0;
      const videoCount = Number(stats.videoCount) || 0;

      // Cập nhật bảng gsa_profile_growth
      await supabase.from('gsa_profile_growth').upsert({
        name: 'TikTok',
        handle: `@${handle}`,
        current_followers: followerCount,
        updated_at: new Date().toISOString()
      }, { onConflict: 'name' });

      // Lưu danh sách video vào social_metrics
      const syncedVideos = [];
      for (const item of videoItems) {
        if (!item?.id) continue;
        const record = {
          platform: 'tiktok',
          author_handle: handle,
          post_id: String(item.id),
          title: item.desc || 'Video TikTok',
          url: `https://www.tiktok.com/@${handle}/video/${item.id}`,
          views: Number(item.stats?.playCount) || 0,
          likes: Number(item.stats?.diggCount) || 0,
          comments: Number(item.stats?.commentCount) || 0,
          shares: Number(item.stats?.shareCount) || 0,
          saves: Number(item.stats?.collectCount) || 0,
          posted_at: item.createTime ? new Date(item.createTime * 1000).toISOString() : new Date().toISOString(),
          synced_at: new Date().toISOString(),
          raw_data: item
        };
        syncedVideos.push(record);
        await supabase.from('social_metrics').upsert(record, { onConflict: 'platform,post_id' });
      }

      return res.status(200).json({
        success: true,
        source: 'server_scrape',
        handle,
        profile: {
          followerCount,
          heartCount,
          videoCount,
          nickname: userInfo.user?.nickname || handle
        },
        videosCount: syncedVideos.length,
        videos: syncedVideos
      });
    }

    // Cơ chế Fallback: Trả về trạng thái hướng dẫn dùng Bookmarklet
    return res.status(200).json({
      success: false,
      fallbackRequired: true,
      message: 'TikTok đang kích hoạt lớp bảo vệ bot (Cloudflare/CAPTCHA). Vui lòng sử dụng Bookmarklet 1-click để đồng bộ từ trình duyệt Chrome!',
      handle
    });

  } catch (err) {
    console.error('Lỗi sync TikTok:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      handle
    });
  }
}
