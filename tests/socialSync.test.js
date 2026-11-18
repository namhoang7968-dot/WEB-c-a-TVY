import { describe, it, expect } from 'vitest';

// Function pV from bookmarklet logic
function pV(s) {
  if (!s) return 0;
  const t = String(s).trim();
  const uM = t.match(/^([\d]+(?:[.,]\d+)?)\s*([KMBkmb])(?![a-zA-Zà-ỹÀ-Ỹ])/i) ||
             t.match(/([\d]+(?:[.,]\d+)?)\s*([KMBkmb])(?:\s|$|[^a-zA-Zà-ỹÀ-Ỹ0-9])/i);
  if (uM) {
    let n = parseFloat(uM[1].replace(',', '.'));
    const u = uM[2].toUpperCase();
    if (u === 'K') n *= 1e3;
    else if (u === 'M') n *= 1e6;
    else if (u === 'B') n *= 1e9;
    return Math.round(n);
  }
  const nM = t.match(/[\d]+(?:[.,]\d+)*/);
  if (nM) {
    const r = nM[0];
    if (/^\d{1,3}[.,]\d{3}$/.test(r)) return parseInt(r.replace(/[.,]/g, ''), 10) || 0;
    return parseInt(r.replace(/[^\d]/g, ''), 10) || 0;
  }
  return 0;
}

describe('Social Media Metric Parser (pV)', () => {
  it('parses plain integers correctly', () => {
    expect(pV('41')).toBe(41);
    expect(pV('10')).toBe(10);
    expect(pV('0')).toBe(0);
    expect(pV('1881')).toBe(1881);
  });

  it('parses K/M/B multipliers accurately', () => {
    expect(pV('1.2K')).toBe(1200);
    expect(pV('15.1K')).toBe(15100);
    expect(pV('23,8K')).toBe(23800);
    expect(pV('2.3M')).toBe(2300000);
  });

  it('does NOT mistake Vietnamese words starting with "b" for Billion', () => {
    expect(pV('10 bình luận')).toBe(10);
    expect(pV('3 bình luận')).toBe(3);
    expect(pV('2 bài viết')).toBe(2);
  });

  it('handles compound strings like "và 40 người khác"', () => {
    const text = 'Thuy Vy và 40 người khác';
    const mAnd = text.match(/và\s+([\d.,]+\s*[KMBkmb]?)\s*người khác/i);
    expect(mAnd).not.toBeNull();
    const likes = (pV(mAnd[1]) || 0) + 1;
    expect(likes).toBe(41);
  });

  it('extracts number tokens from interaction summary row', () => {
    const rowText = '41\n10 comments\n2 shares';
    const tokens = [];
    const lines = rowText.split(/\n|\t|\s{2,}/);
    for (const line of lines) {
      const m = line.trim().match(/^([\d]+(?:[.,]\d+)?(?:\s*[KMBkmb](?![a-zA-Zà-ỹÀ-Ỹ]))?)/);
      if (m) {
        const val = pV(m[1]);
        if (val > 0) tokens.push(val);
      }
    }
    expect(tokens).toEqual([41, 10, 2]);
  });
});

describe('Facebook Views and Reach Regex', () => {
  const regex = /([\d.,]+\s*[KMBkmb]?)\s*(?:views?|lượt xem|lượt phát|plays?|lượt tiếp cận|people reached|reach|accounts reached)/i;

  it('matches video views and reach strings', () => {
    expect('1.5K views'.match(regex)?.[1]?.trim()).toBe('1.5K');
    expect('120 lượt xem'.match(regex)?.[1]?.trim()).toBe('120');
    expect('3.4K People reached'.match(regex)?.[1]?.trim()).toBe('3.4K');
    expect('542 lượt tiếp cận'.match(regex)?.[1]?.trim()).toBe('542');
    expect(pV('120 lượt xem'.match(regex)?.[1])).toBe(120);
  });

  it('does not match standard text with no view keywords', () => {
    expect('Bài viết thông thường không có view'.match(regex)).toBeNull();
  });
});
