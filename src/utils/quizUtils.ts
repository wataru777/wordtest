import { Question, QuestionType, QuizData, Grade } from '@/types/quiz';

const originalQuestions: QuizData = {
  vocabulary: [
    {
      question: "「[[憂鬱]]」の読み方は？",
      choices: ["ゆううつ", "ゆうえつ", "うれいうつ", "ゆうぶつ"],
      correct: 0
    },
    {
      question: "「[[邪魔]]」の意味として正しいものは？",
      choices: ["助けること", "妨げること", "守ること", "集めること"],
      correct: 1
    },
    {
      question: "「[[素朴]]」の読み方は？",
      choices: ["そぼく", "すぼく", "そはく", "すはく"],
      correct: 0
    },
    {
      question: "「[[謙虚]]」の意味として正しいものは？",
      choices: ["威張ること", "怒ること", "控えめなこと", "急ぐこと"],
      correct: 2
    },
    {
      question: "「[[繊細]]」の読み方は？",
      choices: ["せんさい", "せんざい", "しんさい", "しんざい"],
      correct: 0
    },
    {
      question: "「[[寛容]]」の意味として正しいものは？",
      choices: ["厳しいこと", "心が広いこと", "小さいこと", "速いこと"],
      correct: 1
    },
    {
      question: "「[[朗読]]」の読み方は？",
      choices: ["ろうどく", "ろうとく", "らんどく", "らんとく"],
      correct: 0
    },
    {
      question: "「[[勤勉]]」の意味として正しいものは？",
      choices: ["怠けること", "遊ぶこと", "よく働き学ぶこと", "寝ること"],
      correct: 2
    },
    {
      question: "「[[穏やか]]」の読み方は？",
      choices: ["おだやか", "おんやか", "おとやか", "おなやか"],
      correct: 0
    },
    {
      question: "「[[誠実]]」の意味として正しいものは？",
      choices: ["嘘をつくこと", "真面目で正直なこと", "速いこと", "大きいこと"],
      correct: 1
    },
    {
      question: "「[[紛糾]]」の読み方は？",
      choices: ["ふんきゅう", "ふんけい", "ぶんきゅう", "ぶんけい"],
      correct: 0
    },
    {
      question: "「[[憤慨]]」の意味として正しいものは？",
      choices: ["喜ぶこと", "ひどく怒ること", "悲しむこと", "驚くこと"],
      correct: 1
    },
    {
      question: "「[[錯覚]]」の読み方は？",
      choices: ["さっかく", "さくかく", "しゃっかく", "しゃくかく"],
      correct: 0
    },
    {
      question: "「[[抽象的]]」の意味として正しいものは？",
      choices: ["具体的なこと", "はっきりしないこと", "小さいこと", "新しいこと"],
      correct: 1
    },
    {
      question: "「[[殊勝]]」の読み方は？",
      choices: ["しゅしょう", "しゅうしょう", "じゅしょう", "じゅうしょう"],
      correct: 0
    },
    {
      question: "「[[瑣末]]」の意味として正しいものは？",
      choices: ["重要なこと", "大きなこと", "些細なこと", "新しいこと"],
      correct: 2
    },
    {
      question: "「[[畏敬]]」の読み方は？",
      choices: ["いけい", "いきょう", "ひけい", "ひきょう"],
      correct: 0
    },
    {
      question: "「[[逸脱]]」の意味として正しいものは？",
      choices: ["まっすぐ進むこと", "本筋から外れること", "速く走ること", "止まること"],
      correct: 1
    },
    {
      question: "「[[懐疑的]]」の読み方は？",
      choices: ["かいぎてき", "かいきてき", "ふかいてき", "ふきてき"],
      correct: 0
    },
    {
      question: "「[[矜持]]」の意味として正しいものは？",
      choices: ["誇りを持つこと", "恥ずかしがること", "逃げること", "攻撃すること"],
      correct: 0
    }
  ],
  proverb: [
    {
      question: "「石の上にも三年」の意味は？",
      choices: ["石は3年で壊れる", "辛抱強く続ければ成功する", "石の上で3年寝る", "3年経てば忘れる"],
      correct: 1
    },
    {
      question: "「猿も木から落ちる」の意味は？",
      choices: ["猿は木登りが下手", "誰でも失敗することがある", "木は危険である", "猿は弱い動物"],
      correct: 1
    },
    {
      question: "「早起きは三文の徳」の意味は？",
      choices: ["早起きすると3円もらえる", "早起きは損をする", "早起きは良いことがある", "3時に起きるのが良い"],
      correct: 2
    },
    {
      question: "「急がば回れ」の意味は？",
      choices: ["急ぐ時は走る", "慌てずに確実な方法を取る", "回り道は良くない", "急ぐことが大切"],
      correct: 1
    },
    {
      question: "「塵も積もれば山となる」の意味は？",
      choices: ["ゴミは捨てるべき", "小さなことも積み重なれば大きくなる", "山にはゴミが多い", "掃除は大切"],
      correct: 1
    },
    {
      question: "「花より団子」の意味は？",
      choices: ["花は美しい", "実利を重視する", "団子は美味しい", "花見は楽しい"],
      correct: 1
    },
    {
      question: "「馬の耳に念仏」の意味は？",
      choices: ["馬は賢い", "いくら言っても効果がない", "馬はお経が好き", "動物は大切"],
      correct: 1
    },
    {
      question: "「笑う門には福来る」の意味は？",
      choices: ["門で笑うと良い", "明るくしていると幸運が訪れる", "福の神は笑う", "門は大切"],
      correct: 1
    },
    {
      question: "「転ばぬ先の杖」の意味は？",
      choices: ["杖は必要ない", "失敗してから準備する", "前もって用心する", "転んでも大丈夫"],
      correct: 2
    },
    {
      question: "「時は金なり」の意味は？",
      choices: ["時計は高い", "時間は貴重である", "お金で時間が買える", "金は時間で作る"],
      correct: 1
    },
    {
      question: "「覆水盆に返らず」の意味は？",
      choices: ["水は大切にする", "一度起きたことは取り返しがつかない", "お盆は濡れやすい", "水をこぼしてはいけない"],
      correct: 1
    },
    {
      question: "「虎穴に入らずんば虎子を得ず」の意味は？",
      choices: ["虎は危険", "危険を冒さなければ成功しない", "虎の子は可愛い", "穴は危ない"],
      correct: 1
    },
    {
      question: "「蛙の子は蛙」の意味は？",
      choices: ["蛙は成長しない", "子は親に似る", "蛙は子供が多い", "池には蛙がいる"],
      correct: 1
    },
    {
      question: "「井の中の蛙大海を知らず」の意味は？",
      choices: ["蛙は海が嫌い", "見識が狭いこと", "井戸は深い", "海は広い"],
      correct: 1
    },
    {
      question: "「二階から目薬」の意味は？",
      choices: ["目薬は高い所に置く", "効果が期待できない方法", "二階は危険", "目薬は大切"],
      correct: 1
    },
    {
      question: "「画竜点睛」の意味は？",
      choices: ["絵が上手", "最後の仕上げが大切", "竜は目が大きい", "点を打つこと"],
      correct: 1
    },
    {
      question: "「五十歩百歩」の意味は？",
      choices: ["50と100は違う", "大した違いはない", "歩くのは健康的", "数を数える"],
      correct: 1
    },
    {
      question: "「蛇足」の意味は？",
      choices: ["蛇には足がある", "余計なもの", "蛇は速い", "足は大切"],
      correct: 1
    },
    {
      question: "「他山の石」の意味は？",
      choices: ["山には石が多い", "他人の失敗も自分の教訓にする", "石は固い", "山登りは大変"],
      correct: 1
    },
    {
      question: "「朝三暮四」の意味は？",
      choices: ["朝は3時、夕方は4時", "目先の違いにごまかされる", "一日は忙しい", "数字の計算"],
      correct: 1
    }
  ]
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getQuestions(type: QuestionType): Question[] {
  if (typeof window === 'undefined') {
    return originalQuestions[type];
  }
  
  const saved = localStorage.getItem('allQuestions');
  if (saved) {
    try {
      const savedQuestions = JSON.parse(saved);
      return savedQuestions[type] || originalQuestions[type];
    } catch {
      return originalQuestions[type];
    }
  }
  return originalQuestions[type];
}

export function saveQuestions(questions: QuizData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('allQuestions', JSON.stringify(questions));
  }
}

// 削除された初期問題のIDを管理する関数
export function saveDeletedOriginalQuestions(deletedQuestions: {vocabulary: number[], proverb: number[]}): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('deletedOriginalQuestions', JSON.stringify(deletedQuestions));
  }
}

export function getDeletedOriginalQuestions(): {vocabulary: number[], proverb: number[]} {
  if (typeof window === 'undefined') {
    return { vocabulary: [], proverb: [] };
  }
  
  const saved = localStorage.getItem('deletedOriginalQuestions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { vocabulary: [], proverb: [] };
    }
  }
  return { vocabulary: [], proverb: [] };
}

export function getGrade(correctCount: number, totalQuestions: number): Grade {
  const percentage = correctCount / totalQuestions;
  
  if (percentage >= 0.9) {
    return {
      letter: 'S',
      className: 'text-yellow-500',
      comment: 'すばらしい！完璧に近い成績です！\n日頃の勉強の成果が出ていますね。'
    };
  } else if (percentage >= 0.7) {
    return {
      letter: 'A',
      className: 'text-red-500',
      comment: 'よくできました！\nもう少しで完璧です。この調子で頑張りましょう！'
    };
  } else if (percentage >= 0.5) {
    return {
      letter: 'B',
      className: 'text-blue-500',
      comment: 'まずまずの成績です。\n間違えた問題を復習して、次はAを目指しましょう！'
    };
  } else {
    return {
      letter: 'C',
      className: 'text-green-500',
      comment: 'もう少し頑張りましょう。\n毎日少しずつ勉強すれば、必ず上達します！'
    };
  }
}

export function getAllQuestions(): QuizData {
  if (typeof window === 'undefined') {
    return originalQuestions;
  }
  
  const saved = localStorage.getItem('allQuestions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return originalQuestions;
    }
  }
  return originalQuestions;
}

// データベースから問題を取得する関数
export async function fetchQuestionsFromDB(): Promise<QuizData> {
  try {
    const [vocabularyResponse, proverbResponse] = await Promise.all([
      fetch('/api/questions?type=vocabulary'),
      fetch('/api/questions?type=proverb')
    ]);

    if (!vocabularyResponse.ok || !proverbResponse.ok) {
      throw new Error('Failed to fetch questions from database');
    }

    const vocabularyQuestions = await vocabularyResponse.json();
    const proverbQuestions = await proverbResponse.json();

    // 削除された初期問題を取得
    const deletedOriginal = getDeletedOriginalQuestions();
    
    // 削除されていない初期問題のみを含める
    const filteredOriginalVocabulary = originalQuestions.vocabulary.filter((_, index) => 
      !deletedOriginal.vocabulary.includes(index)
    );
    const filteredOriginalProverb = originalQuestions.proverb.filter((_, index) => 
      !deletedOriginal.proverb.includes(index)
    );
    
    // データベースから取得した問題と削除されていない元の問題をマージ
    const mergedQuestions: QuizData = {
      vocabulary: [...filteredOriginalVocabulary, ...vocabularyQuestions],
      proverb: [...filteredOriginalProverb, ...proverbQuestions]
    };

    // localStorageも更新
    saveQuestions(mergedQuestions);
    
    return mergedQuestions;
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    // エラーの場合は元の問題とlocalStorageの内容を返す
    return getAllQuestions();
  }
}

export function getOriginalQuestions(): QuizData {
  return originalQuestions;
}

export function parseCsv(csvText: string): Question[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const questions: Question[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    
    const columns = line.split(',').map(col => col.trim());
    
    if (columns.length < 4) {
      throw new Error(`行 ${i + 1}: 最低4列必要です (問題文、正解、不正解1、不正解2)`);
    }
    
    const question: Question = {
      question: columns[0],
      choices: [columns[1], columns[2], columns[3]],
      correct: 0
    };
    
    // 4択の場合は5番目の列を追加
    if (columns.length >= 5 && columns[4].trim() !== '') {
      question.choices.push(columns[4]);
    }
    
    questions.push(question);
  }
  
  return questions;
}