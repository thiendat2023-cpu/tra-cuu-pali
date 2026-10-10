export interface VibhattiCase {
  number: number;
  paliName: string;
  vietnameseName: string;
  englishName: string;
  question: string;
  vietnameseParticle: string;
  description: string;
  masculineAEndingSg: string;
  masculineAEndingPl: string;
}

export const VIBHATTI_CASES: VibhattiCase[] = [
  {
    number: 1,
    paliName: 'Paṭhamā',
    vietnameseName: 'Chủ cách (Danh cách)',
    englishName: 'Nominative',
    question: 'Ai? Cái gì? (Chủ thể hành động)',
    vietnameseParticle: '[Chủ từ / người ấy / điều ấy]',
    description: 'Chỉ chủ từ của câu, đối tượng thực hiện hành động hoặc đối tượng được miêu tả.',
    masculineAEndingSg: '-o (buddho)',
    masculineAEndingPl: '-ā (buddhā)',
  },
  {
    number: 2,
    paliName: 'Dutiyā',
    vietnameseName: 'Đối cách (Tác cách / Nghiệp cách)',
    englishName: 'Accusative',
    question: 'Đến ai? Vào cái gì? (Đối tượng trực tiếp)',
    vietnameseParticle: 'đến..., vào..., nơi...',
    description: 'Chỉ túc số trực tiếp của ngoại động từ hoặc nơi chốn hướng tới.',
    masculineAEndingSg: '-aṃ (buddhaṃ)',
    masculineAEndingPl: '-e (buddhe)',
  },
  {
    number: 3,
    paliName: 'Tatiyā',
    vietnameseName: 'Sử dụng cách (Công cụ cách)',
    englishName: 'Instrumental',
    question: 'Bằng cái gì? Với ai? Nhờ điều gì?',
    vietnameseParticle: 'bằng..., nhờ..., với...',
    description: 'Chỉ phương tiện, công cụ, khí cụ thực hiện hành động, hoặc nguyên nhân gián tiếp.',
    masculineAEndingSg: '-ena (buddhena)',
    masculineAEndingPl: '-ehi, -ebhi (buddhehi)',
  },
  {
    number: 4,
    paliName: 'Catutthī',
    vietnameseName: 'Chỉ định cách (Cung hiến cách)',
    englishName: 'Dative',
    question: 'Cho ai? Đến ai? Vì điều gì?',
    vietnameseParticle: 'cho..., đến..., vì lợi ích của...',
    description: 'Chỉ đối tượng gián tiếp đón nhận, người được trao tặng, hoặc mục đích hành động.',
    masculineAEndingSg: '-assa, -āya (buddhassa)',
    masculineAEndingPl: '-ānaṃ (buddhānaṃ)',
  },
  {
    number: 5,
    paliName: 'Pañcamī',
    vietnameseName: 'Xuất xứ cách (Rời cách)',
    englishName: 'Ablative',
    question: 'Từ đâu? Từ ai? Khỏi điều gì?',
    vietnameseParticle: 'từ..., khỏi..., do bởi...',
    description: 'Chỉ điểm xuất phát, nguồn gốc, sự tách rời, sợ hãi hoặc nguyên nhân trực tiếp.',
    masculineAEndingSg: '-ā, -asmā, -amhā (buddhā)',
    masculineAEndingPl: '-ehi, -ebhi (buddhehi)',
  },
  {
    number: 6,
    paliName: 'Chaṭṭhī',
    vietnameseName: 'Sở thuộc cách (Sở hữu cách)',
    englishName: 'Genitive',
    question: 'Của ai? Của cái gì?',
    vietnameseParticle: 'của..., thuộc về...',
    description: 'Chỉ quan hệ sở hữu, thuộc tính, mối liên hệ giữa các danh từ.',
    masculineAEndingSg: '-assa (buddhassa)',
    masculineAEndingPl: '-ānaṃ (buddhānaṃ)',
  },
  {
    number: 7,
    paliName: 'Sattamī',
    vietnameseName: 'Định vị cách (Xứ cách)',
    englishName: 'Locative',
    question: 'Ở đâu? Trong cái gì? Vào lúc nào?',
    vietnameseParticle: 'ở..., tại..., trong..., nơi...',
    description: 'Chỉ nơi chốn diễn ra hành động, vị trí không gian hoặc thời điểm diễn ra.',
    masculineAEndingSg: '-e, -asmiṃ, -amhi (buddhe)',
    masculineAEndingPl: '-esu (buddhesu)',
  },
  {
    number: 8,
    paliName: 'Ālapana',
    vietnameseName: 'Hô cách (Kêu gọi cách)',
    englishName: 'Vocative',
    question: 'Này ai! Hỡi ai!',
    vietnameseParticle: 'Này...! Hỡi...!',
    description: 'Dùng để kêu gọi, xưng hô trực tiếp với một người hay đối tượng.',
    masculineAEndingSg: '-a, -ā (buddha)',
    masculineAEndingPl: '-ā (buddhā)',
  },
];

export interface VerbPurisa {
  paliName: string;
  vietnameseName: string;
  englishEquivalent: string;
  endingSg: string;
  endingPl: string;
  exampleSg: string;
  examplePl: string;
}

export const VERB_PURISA_LIST: VerbPurisa[] = [
  {
    paliName: 'Paṭhama-purisa',
    vietnameseName: 'Ngôi thứ ba (Người được nói đến)',
    englishEquivalent: '3rd Person (He, She, It, They)',
    endingSg: '-ti',
    endingPl: '-nti',
    exampleSg: 'gacchati (vị ấy đi)',
    examplePl: 'gacchanti (các vị ấy đi)',
  },
  {
    paliName: 'Majjhima-purisa',
    vietnameseName: 'Ngôi thứ hai (Người đang nghe)',
    englishEquivalent: '2nd Person (You / Tvaṃ, Tumhe)',
    endingSg: '-si',
    endingPl: '-tha',
    exampleSg: 'gacchasi (ngươi đi)',
    examplePl: 'gacchatha (các ngươi đi)',
  },
  {
    paliName: 'Uttama-purisa',
    vietnameseName: 'Ngôi thứ nhất (Người đang nói)',
    englishEquivalent: '1st Person (I, We / Ahaṃ, Mayaṃ)',
    endingSg: '-mi',
    endingPl: '-ma',
    exampleSg: 'gacchāmi (tôi đi)',
    examplePl: 'gacchāma (chúng tôi đi)',
  },
];

export interface PresetTerm {
  word: string;
  category: 'Danh từ Nam tính' | 'Danh từ Nữ tính' | 'Danh từ Trung tính' | 'Động từ' | 'Phật pháp Căn bản';
  shortGloss: string;
}

export const PRESET_PALI_TERMS: PresetTerm[] = [
  { word: 'buddhassa', category: 'Danh từ Nam tính', shortGloss: 'Đến Đức Phật / Của Đức Phật' },
  { word: 'dhammena', category: 'Danh từ Nam tính', shortGloss: 'Nhờ Giáo Pháp / Bằng Chánh Pháp' },
  { word: 'saṅghaṃ', category: 'Danh từ Nam tính', shortGloss: 'Đến Tăng đoàn (Đối cách)' },
  { word: 'bhikkhave', category: 'Danh từ Nam tính', shortGloss: 'Này các Tỳ-khưu! (Hô cách số nhiều)' },
  { word: 'paññāya', category: 'Danh từ Nữ tính', shortGloss: 'Bằng Trí tuệ / Của Trí tuệ' },
  { word: 'mettāya', category: 'Danh từ Nữ tính', shortGloss: 'Với Tâm từ ái / Nhờ lòng từ' },
  { word: 'nibbānaṃ', category: 'Danh từ Trung tính', shortGloss: 'Niết-bàn (Chủ cách/Đối cách)' },
  { word: 'dukkhaṃ', category: 'Danh từ Trung tính', shortGloss: 'Sự khổ đau, bất toại nguyện' },
  { word: 'cittasmiṃ', category: 'Danh từ Trung tính', shortGloss: 'Ở trong tâm, tại nơi tâm' },
  { word: 'gacchati', category: 'Động từ', shortGloss: 'Vị ấy đi (Ngôi 3 số ít)' },
  { word: 'deseti', category: 'Động từ', shortGloss: 'Ngài thuyết giảng (Ngôi 3 số ít)' },
  { word: 'caratha', category: 'Động từ', shortGloss: 'Các ngươi hãy du hành (Mệnh lệnh / Ngôi 2 số nhiều)' },
  { word: 'karomi', category: 'Động từ', shortGloss: 'Tôi làm, tôi tác hành (Ngôi 1 số ít)' },
  { word: 'anattā', category: 'Phật pháp Căn bản', shortGloss: 'Vô ngã (không có tự ngã)' },
  { word: 'aniccaṃ', category: 'Phật pháp Căn bản', shortGloss: 'Vô thường (không trường tồn)' },
];

export const PALI_DIACRITICS = [
  { char: 'ā', label: 'a dài' },
  { char: 'ī', label: 'i dài' },
  { char: 'ū', label: 'u dài' },
  { char: 'ṃ', label: 'niggahīta (m chấm dưới)' },
  { char: 'ṁ', label: 'm chấm trên' },
  { char: 'ṅ', label: 'n ngạc mềm (ng)' },
  { char: 'ñ', label: 'n vòm họng (nh)' },
  { char: 'ṭ', label: 't quặt lưỡi' },
  { char: 'ḍ', label: 'd quặt lưỡi' },
  { char: 'ṇ', label: 'n quặt lưỡi' },
  { char: 'ḷ', label: 'l quặt lưỡi' },
];
