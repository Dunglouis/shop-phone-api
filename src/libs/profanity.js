const profanity = require("leo-profanity");

try {
  profanity.loadDictionary("vi");
} catch (e) {
  // nếu không có dictionary 'vi' thì dùng mặc định
  profanity.loadDictionary();
}

profanity.add(["đéo", "deo", "địt", "dit"]);
const removeDiacritics = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
module.exports = {
  containsBadWord: (text) => {
    if (!text) return false;
    // kiểm tra cả chuỗi gốc và chuỗi đã bỏ dấu
    return profanity.check(text) || profanity.check(removeDiacritics(text));
  },

  sanitize: (text) => {
    if (!text) return text;
    const cleaned = profanity.clean(text);
    if (cleaned !== text) return cleaned;
    const normalized = removeDiacritics(text);
    const cleanedNormalized = profanity.clean(normalized);
    // nếu cleanedNormalized thay đổi, thay các từ tương ứng trong original bằng *** dựa trên normalized
    if (cleanedNormalized !== normalized) {
      // map từng từ bị thay thế sang vị trí tương ứng trong original (đơn giản thay cả chuỗi normalized -> cleanedNormalized)
      // thay trực tiếp các từ cấm trong original bằng ***
      let out = text;
      ["đéo", "deo", "địt", "dit"].forEach((w) => {
        const re = new RegExp(w, "ig");
        out = out.replace(re, "***");
      });
      return out;
    }
    return text;
  },
};
