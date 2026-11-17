// Social Media Sync Service (TikTok & Facebook)
// Handles API calls, Supabase sync, and Bookmarklet generators

import { supabase, SUPABASE_CONFIG } from './supabaseClient';

export const FB_BOOKMARKLET_CODE = `javascript:(function(){const S_URL="${SUPABASE_CONFIG.url}",S_KEY="${SUPABASE_CONFIG.anonKey}";const t=document.createElement("div");t.style.cssText="position:fixed;bottom:24px;right:24px;z-index:999999;background:#1877F2;color:#fff;padding:14px 20px;border-radius:12px;font-family:sans-serif;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.25);display:flex;align-items:center;gap:10px;";t.innerHTML="<span style='font-size:18px'>⚡</span> Đang quét số liệu Facebook...";document.body.appendChild(t);const posts=[];const feedEls=document.querySelectorAll('div[role="feed"] > div, div[data-pagelet*="FeedUnit_"]');feedEls.forEach((el,idx)=>{try{const text=el.innerText||"";if(text.length<15)return;let likes=0;const rEl=el.querySelector('[aria-label*="cảm xúc"],[aria-label*="reactions"],[aria-label*="người thích"]');if(rEl){const m=rEl.getAttribute("aria-label").match(/(\\d+[\\d\\.,]*)/);if(m)likes=parseInt(m[1].replace(/[.,]/g,""))||0;}let comments=0;const cM=text.match(/(\\d+[\\d\\.,]*)\\s*(bình luận|comments)/i);if(cM)comments=parseInt(cM[1].replace(/[.,]/g,""))||0;let shares=0;const sM=text.match(/(\\d+[\\d\\.,]*)\\s*(lượt chia sẻ|chia sẻ|shares)/i);if(sM)shares=parseInt(sM[1].replace(/[.,]/g,""))||0;let views=0;const vM=text.match(/(\\d+[\\d\\.,]*)\\s*(lượt xem|views)/i);if(vM)views=parseInt(vM[1].replace(/[.,]/g,""))||0;const lines=text.split("\\n").filter(l=>l.trim().length>10&&!l.includes("Thích")&&!l.includes("Bình luận")&&!l.includes("Chia sẻ"));const snippet=lines.slice(0,2).join(" — ").substring(0,140);if(snippet&&(likes>0||comments>0||shares>0||views>0||snippet.length>20)){posts.push({platform:"facebook",author_handle:"thuyvy.vandinh",post_id:"fb-"+(idx+1)+"-"+Date.now(),title:snippet||"Bài viết Facebook",url:window.location.href,views:views||(likes*15+80),likes:likes,comments:comments,shares:shares,saves:0,posted_at:new Date().toISOString(),synced_at:new Date().toISOString()});}}catch(e){}});if(posts.length===0){t.style.background="#E11D48";t.innerHTML="⚠️ Không thấy bài viết nào. Hãy cuộn xuống rồi bấm lại nhé!";setTimeout(()=>t.remove(),4000);return;}fetch(S_URL+"/rest/v1/social_metrics",{method:"POST",headers:{"Content-Type":"application/json","apikey":S_KEY,"Authorization":"Bearer "+S_KEY,"Prefer":"resolution=merge-duplicates"},body:JSON.stringify(posts)}).then(res=>{if(!res.ok)throw new Error("HTTP "+res.status);t.style.background="#10B981";t.innerHTML="✅ Đã đồng bộ <b>"+posts.length+"</b> bài Facebook về GSA Studio!";setTimeout(()=>t.remove(),5000);}).catch(err=>{t.style.background="#E11D48";t.innerHTML="❌ Lỗi: "+err.message;setTimeout(()=>t.remove(),5000);});})();`;

export const TIKTOK_BOOKMARKLET_CODE = `javascript:(function(){const S_URL="${SUPABASE_CONFIG.url}",S_KEY="${SUPABASE_CONFIG.anonKey}";const t=document.createElement("div");t.style.cssText="position:fixed;bottom:24px;right:24px;z-index:999999;background:#000;color:#fff;border:1px solid #444;padding:14px 20px;border-radius:12px;font-family:sans-serif;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.5);display:flex;align-items:center;gap:10px;";t.innerHTML="<span style='font-size:18px'>🎵</span> Đang quét TikTok @thuyvy.risetoshine...";document.body.appendChild(t);try{const data=window.__UNIVERSAL_DATA_FOR_REHYDRATION__;const defaultScope=data?.__DEFAULT_SCOPE__;const userDetail=defaultScope?.['webapp.user-detail'];const userInfo=userDetail?.userInfo;const itemList=userDetail?.itemList||[];const itemModule=defaultScope?.['webapp.user-detail']?.itemModule||{};const followerCount=Number(userInfo?.stats?.followerCount)||0;if(followerCount>0){fetch(S_URL+"/rest/v1/gsa_profile_growth",{method:"POST",headers:{"Content-Type":"application/json","apikey":S_KEY,"Authorization":"Bearer "+S_KEY,"Prefer":"resolution=merge-duplicates"},body:JSON.stringify({name:"TikTok",handle:"@thuyvy.risetoshine",current_followers:followerCount,updated_at:new Date().toISOString()})});}const videos=itemList.map(id=>itemModule[id]).filter(Boolean).map(v=>({platform:"tiktok",author_handle:"thuyvy.risetoshine",post_id:String(v.id),title:v.desc||"Video TikTok",url:"https://www.tiktok.com/@thuyvy.risetoshine/video/"+v.id,views:Number(v.stats?.playCount)||0,likes:Number(v.stats?.diggCount)||0,comments:Number(v.stats?.commentCount)||0,shares:Number(v.stats?.shareCount)||0,saves:Number(v.stats?.collectCount)||0,posted_at:v.createTime?new Date(v.createTime*1000).toISOString():new Date().toISOString(),synced_at:new Date().toISOString()}));if(videos.length===0){t.style.background="#E11D48";t.innerHTML="⚠️ Không tìm thấy video. Hãy cuộn trang TikTok để load video rồi bấm lại nhé!";setTimeout(()=>t.remove(),4000);return;}fetch(S_URL+"/rest/v1/social_metrics",{method:"POST",headers:{"Content-Type":"application/json","apikey":S_KEY,"Authorization":"Bearer "+S_KEY,"Prefer":"resolution=merge-duplicates"},body:JSON.stringify(videos)}).then(r=>{t.style.background="#10B981";t.innerHTML="✅ Đã đồng bộ <b>"+videos.length+"</b> video TikTok ("+followerCount.toLocaleString()+" followers) về Supabase!";setTimeout(()=>t.remove(),5000);});}catch(e){t.style.background="#E11D48";t.innerHTML="❌ Lỗi đọc dữ liệu: "+e.message;setTimeout(()=>t.remove(),4000);}})();`;

export const socialSyncService = {
  // Sync TikTok via Serverless API
  syncTikTok: async () => {
    try {
      const response = await fetch('/api/sync-tiktok?handle=thuyvy.risetoshine');
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('API sync failed:', err);
      return { success: false, error: err.message };
    }
  },

  // Fetch social metrics from Supabase
  fetchMetrics: async (platform = null) => {
    try {
      let query = supabase.from('social_metrics').select('*').order('posted_at', { ascending: false });
      if (platform) {
        query = query.eq('platform', platform);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Error fetching social metrics:', err);
      return [];
    }
  }
};
