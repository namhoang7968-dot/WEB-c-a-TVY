import { describe, it, expect } from 'vitest';
import { INITIAL_CONTENTS } from '@/services/contentService';

describe('Content Management Service (contentService)', () => {
  it('loads INITIAL_CONTENTS with default starter tasks', () => {
    expect(INITIAL_CONTENTS).toBeDefined();
    expect(INITIAL_CONTENTS.length).toBeGreaterThan(0);
  });

  it('contains mandatory posts (Bài bắt buộc)', () => {
    const requiredPosts = INITIAL_CONTENTS.filter(item => item.group === 'Bài bắt buộc');
    expect(requiredPosts.length).toBeGreaterThan(0);
  });

  it('every content item has required fields (id, code, group, topic, channel, format, scheduledDate, status)', () => {
    INITIAL_CONTENTS.forEach(item => {
      expect(item.id).toBeTruthy();
      expect(item.code).toBeTruthy();
      expect(item.group).toMatch(/Bài bắt buộc|Nội dung bổ sung/);
      expect(item.topic).toBeTruthy();
      expect(item.channel).toBeTruthy();
      expect(item.format).toBeTruthy();
      expect(item.scheduledDate).toBeTruthy();
      expect(item.status).toMatch(/Đang làm|Đã đăng|Chưa làm/);
    });
  });

  it('filters contents by search term correctly', () => {
    const searchTerm = 'tiktok';
    const filtered = INITIAL_CONTENTS.filter(item =>
      item.code.toLowerCase().includes(searchTerm) ||
      item.channel.toLowerCase().includes(searchTerm) ||
      item.topic.toLowerCase().includes(searchTerm)
    );
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(item => {
      const match = item.code.toLowerCase().includes(searchTerm) ||
                    item.channel.toLowerCase().includes(searchTerm) ||
                    item.topic.toLowerCase().includes(searchTerm);
      expect(match).toBe(true);
    });
  });
});
