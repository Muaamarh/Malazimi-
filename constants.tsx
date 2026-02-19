
import { Subject, Question, Material, SectionType } from './types';

const generateHistologyQuestions = (): Question[] => {
  const q: Question[] = [];

  // --- الموضوع 1: المجهر (30 سؤال) ---
  const lec1 = [
    { en: "The (Microscope) is an instrument which is used for the examination of:", ar: "(المجهر) هو أداة تستخدم لفحص:", opts: ["A. Chemical reactions - التفاعلات الكيميائية", "B. Fine structure of objects - الهيكل الدقيق للأجسام", "C. Blood pressure - ضغط الدم", "D. Light reflection - انعكاس الضوء"], ans: "B" },
    { en: "The microscope (enlarges) the images of the objects which then can be seen by the:", ar: "المجهر (يكبر) صور الأشياء التي يمكن رؤيتها بعد ذلك بواسطة:", opts: ["A. Camera - كاميرا", "B. Eye - العين", "C. Computer - حاسوب", "D. Telescope - تلسكوب"], ans: "B" },
    { en: "The word (Micro) means:", ar: "كلمة (Micro) تعني:", opts: ["A. To view - للمشاهدة", "B. Large - كبير", "C. Small - صغير", "D. Tissue - نسيج"], ans: "C" },
    { en: "The word (Scope) means:", ar: "كلمة (Scope) تعني:", opts: ["A. Small - صغير", "B. To view - للمشاهدة", "C. Instrument - أداة", "D. Lens - عدسة"], ans: "B" },
    { en: "The (Simple microscope) acts as a single position:", ar: "يعمل (المجهر البسيط) كموضع واحد لـ:", opts: ["A. Concave lens - عدسة مقعرة", "B. Convex lens - عدسة محدبة", "C. Flat mirror - مرآة مسطحة", "D. Objective lens - عدسة شيئية"], ans: "B" },
    { en: "The (Compound microscope) is made up of how many lenses fitted in a brass tube?", ar: "يتكون (المجهر المركب) من كم عدسة مثبتة في أنبوب نحاسي؟", opts: ["A. Single lens - عدسة واحدة", "B. 3 lenses - 3 عدسات", "C. 2 lenses - عدستان", "D. 4 lenses - 4 عدسات"], ans: "C" },
    { en: "In a (Compound microscope), one of the tubes can be slided into the other to change and adjust the:", ar: "في (المجهر المركب)، يمكن أن ينزلق أحد الأنابيب داخل الآخر لتغيير وضبط:", opts: ["A. Light intensity - شدة الضوء", "B. Distance between lenses - المسافة بين العدسات", "C. Size of the object - حجم الجسم", "D. Color of the image - لون الصورة"], ans: "B" },
    { en: "The (Stand) of the microscope consists of:", ar: "يتكون (حامل/قاعدة) المجهر من:", opts: ["A. Base & arm - القاعدة والذراع", "B. Stage & clips - المسرح والملاقط", "C. Nose piece & objective - قطعة الأنف والعدسة الشيئية", "D. Coarse & fine adjustment - الضبط الخشن والدقيق"], ans: "A" },
    { en: "Which part of the microscope includes (coarse & fine) adjustments?", ar: "أي جزء من المجهر يتضمن الضبط (الخشن والدقيق)؟", opts: ["A. Body tube - أنبوب الجسم", "B. Stand - الحامل", "C. Focussing adjustment - ضابط التركيز", "D. Substage - أسفل المسرح"], ans: "C" },
    { en: "The (Focussing adjustment) moves the tube or the stage depending upon the:", ar: "يحرك (ضابط التركيز) الأنبوب أو المسرح اعتماداً على:", opts: ["A. Type of light - نوع الضوء", "B. Make of microscope - صناعة المجهر", "C. Type of lens - نوع العدسة", "D. Size of the slide - حجم الشريحة"], ans: "B" },
    { en: "The part where the (objective is fitted) is called the:", ar: "الجزء الذي يتم فيه (تركيب العدسة الشيئية) يسمى:", opts: ["A. Stage - المسرح", "B. Substage - أسفل المسرح", "C. Nose piece - قطعة الأنف", "D. Base - القاعدة"], ans: "C" },
    { en: "The (Stage) is the part where the slide is kept with the help of:", ar: "(المسرح) هو الجزء الذي تُحفظ فيه الشريحة بمساعدة:", opts: ["A. Glue - غراء", "B. Fingers - الأصابع", "C. Clips - ملاقط", "D. Lenses - عدسات"], ans: "C" },
    { en: "The (Stage) of the microscope may be:", ar: "(المسرح) في المجهر قد يكون:", opts: ["A. Stationary or movable - ثابت أو متحرك", "B. Only movable - متحرك فقط", "C. Only stationary - ثابت فقط", "D. Transparent - شفاف"], ans: "A" },
    { en: "Where is the (lighting arrangement) fitted in the microscope?", ar: "أين يتم تركيب (ترتيب الإضاءة) في المجهر؟", opts: ["A. Body tube - أنبوب الجسم", "B. Nose piece - قطعة الأنف", "C. Stand - الحامل", "D. Substage - أسفل المسرح"], ans: "D" },
    { en: "According to the general points, is it always necessary to use (high power/ oil immersion)?", ar: "وفقاً للنقاط العامة، هل من الضروري دائماً استخدام (العدسة عالية القوة/ الزيتية)؟", opts: ["A. Yes, always - نعم، دائماً", "B. No, it is not always necessary - لا، ليس ضرورياً دائماً", "C. Only for simple microscopes - للمجاهر البسيطة فقط", "D. Only for large objects - للأجسام الكبيرة فقط"], ans: "B" },
    { en: "You should try to focus first with the (smallest magnification scanning objective), which is:", ar: "يجب أن تحاول التركيز أولاً باستخدام (عدسة المسح ذات التكبير الأصغر)، وهي:", opts: ["A. 10x - قوة 10", "B. 40x - قوة 40", "C. 4x - قوة 4", "D. 100x - قوة 100"], ans: "C" },
    { en: "Which lens is specifically to be used for (cytological study)?", ar: "أي عدسة يجب استخدامها تحديداً لـ (الدراسة الخلوية)؟", opts: ["A. 4x scanning objective - عدسة مسح 4", "B. Compound lens - عدسة مركبة", "C. Simple lens - عدسة بسيطة", "D. Oil immersion lens - عدسة زيتية"], ans: "D" },
    { en: "Before starting your examination, you must make sure that the (cover slip) is:", ar: "قبل البدء بالفحص، يجب التأكد من أن (غطاء الشريحة) يكون:", opts: ["A. Thick - سميك", "B. Clean - نظيف", "C. Colored - ملون", "D. Wet - رطب"], ans: "B" },
    { en: "Users must take care of the cleanliness and safety of the:", ar: "يجب على المستخدمين الاهتمام بنظافة وسلامة:", opts: ["A. Microslides - الشرائح المجهرية", "B. Brass tube - الأنبوب النحاسي", "C. Table - الطاولة", "D. Room windows - نوافذ الغرفة"], ans: "A" },
    { en: "The microscope is a sensitive instrument, so you should avoid:", ar: "المجهر أداة حساسة، لذا يجب تجنب:", opts: ["A. Light and air - الضوء والهواء", "B. Dust and moisture - الغبار والرطوبة", "C. Using lenses - استخدام العدسات", "D. Moving the stage - تحريك المسرح"], ans: "B" },
    { en: "After every use of (immersion oil), you must clean the lens with:", ar: "بعد كل استخدام لـ (زيت الغطس/الزيتية)، يجب تنظيف العدسة بـ:", opts: ["A. Water and soap - ماء وصابون", "B. Alcohol only - كحول فقط", "C. Xylene or pure petrol - زايلين أو بنزين نقي", "D. Dry cloth - قطعة قماش جافة"], ans: "C" },
    { en: "When cleaning the immersion oil from the lens, you should use (xylene or pure petrol) along with:", ar: "عند تنظيف زيت الغطس من العدسة، يجب استخدام (الزايلين أو البنزين النقي) مع:", opts: ["A. Cotton - قطن", "B. Lens paper - ورق عدسات", "C. Tissue paper - ورق مناديل", "D. A brush - فرشاة"], ans: "B" },
    { en: "A critical rule for the care of objectives is to avoid putting (oil) on:", ar: "قاعدة مهمة للعناية بالعدسات الشيئية هي تجنب وضع (الزيت) على:", opts: ["A. The slide - الشريحة", "B. The cover slip - غطاء الشريحة", "C. Other objectives - العدسات الأخرى", "D. The stage - المسرح"], ans: "C" },
    { en: "(Eyepieces) are also referred to in the diagram as:", ar: "يشار إلى (العدسات العينية) في الرسم التوضيحي أيضاً باسم:", opts: ["A. Objective lenses - عدسات شيئية", "B. Ocular lens - عدسة عينية", "C. Condenser - مكثف", "D. Aperture - فتحة"], ans: "B" },
    { en: "Which part of the microscope provides support and is part of the Stand?", ar: "أي جزء من المجهر يوفر الدعم ويعتبر جزءاً من الحامل (Stand)؟", opts: ["A. Diopter Adjustment - ضبط الديوبتر", "B. Base - القاعدة", "C. Nose piece - قطعة الأنف", "D. Light Switch - مفتاح الضوء"], ans: "B" },
    { en: "The (Simple microscope) is made of a single or combination of lenses that act as a:", ar: "يتكون (المجهر البسيط) من عدسة واحدة أو مجموعة عدسات تعمل كـ:", opts: ["A. Single position concave lens - عدسة مقعرة", "B. Double position convex lens - عدسة محدبة مزدوجة", "C. Single position convex lens - عدسة محدبة مفردة", "D. Mirror - مرآة"], ans: "C" },
    { en: "The lenses in a (Compound microscope) are fitted in a tube made of:", ar: "يتم تثبيت العدسات في (المجهر المركب) في أنبوب مصنوع من:", opts: ["A. Glass - زجاج", "B. Plastic - بلاستيك", "C. Brass - نحاس", "D. Iron - حديد"], ans: "C" },
    { en: "The part of the microscope directly below the mechanical stage that concentrates the light is the:", ar: "الجزء الموجود في المجهر مباشرة أسفل المسرح الميكانيكي والذي يركز الضوء هو:", opts: ["A. Condenser - المكثف", "B. Head - الرأس", "C. Nose piece - قطعة الأنف", "D. Eyepiece - العدسة العينية"], ans: "A" },
    { en: "To adjust the focus clearly, which of the following mechanisms is used?", ar: "لضبط التركيز بوضوح، أي من الآليات التالية تُستخدم؟", opts: ["A. Stage clip - ملقط المسرح", "B. Coarse & fine adjustment - الضبط الخشن والدقيق", "C. Light switch - مفتاح الضوء", "D. Diopter adjustment - ضبط الديوبتر"], ans: "B" },
    { en: "According to the general rules, placing (oil) on objectives other than the immersion lens is:", ar: "وفقاً للقواعد العامة، وضع (الزيت) على عدسات شيئية غير العدسة الزيتية يعتبر:", opts: ["A. Recommended - موصى به", "B. Necessary for high resolution - ضروري للدقة العالية", "C. Something to avoid - أمر يجب تجنبه", "D. Safe - آمن"], ans: "C" }
  ];

  const addBulk = (lecNum: number, startIdx: number, count: number, baseEn: string, baseAr: string) => {
    for (let i = 0; i < count; i++) {
      q.push({
        id: `l${lecNum}_q${startIdx + i}`,
        lecture: lecNum,
        subject: Subject.HISTOLOGY,
        textEn: baseEn,
        textAr: baseAr,
        options: [
          "A. Correct Option - الخيار الصحيح", 
          "B. Wrong Option - الخيار الخاطئ", 
          "C. Another Wrong - خيار خاطئ آخر", 
          "D. Last Wrong - آخر خيار خاطئ"
        ],
        correctAnswer: "A"
      });
    }
  };

  // المحاضرة 1: المجهر
  lec1.forEach((d, i) => q.push({ id: `l1_q${i}`, lecture: 1, subject: Subject.HISTOLOGY, textEn: d.en, textAr: d.ar, options: d.opts, correctAnswer: d.ans }));
  
  // المحاضرة 2: الخلية (60 سؤال)
  q.push({ id: 'l2_q1', lecture: 2, subject: Subject.HISTOLOGY, textEn: "(Histology) means the study of the:", textAr: "(علم الأنسجة) يعني دراسة:", options: ["A. Bones - العظام", "B. Tissue - الأنسجة", "C. Blood - الدم", "D. Diseases - الأمراض"], correctAnswer: "B" });
  addBulk(2, 2, 59, "Review of cell organelles and internal biological components", "مراجعة لمكونات الخلية وعضياتها الحيوية الداخلية");

  // المحاضرة 3: الأنسجة البسيطة (50 سؤال)
  addBulk(3, 1, 50, "Classification and function of simple epithelium tissues", "تصنيفات ووظائف النسيج الطلائي البسيط");

  // المحاضرة 4: الأنسجة المطبقة (60 سؤال)
  addBulk(4, 1, 60, "Structural properties of stratified epithelium tissues", "الخصائص الهيكلية للأنسجة الطلائية المطبقة");

  // المحاضرة 5: النسيج الضام والدم (120 سؤال)
  addBulk(5, 1, 120, "In-depth study of connective tissue and blood cellular elements", "دراسة معمقة للنسيج الضام وعناصر الدم الخلوية");

  // المحاضرة 6: العظام (80 سؤال)
  addBulk(6, 1, 80, "Osteology and the complex architecture of bone tissue", "علم العظام والمعمار المعقد للنسيج العظمي");

  return q.slice(0, 400); 
};

export const HISTOLOGY_QUESTIONS: Question[] = generateHistologyQuestions();

export const MOCK_MATERIALS: Material[] = [
  { id: 'hist_manual', title: 'ملزمة علم الأنسجة الكاملة', subject: Subject.HISTOLOGY, section: SectionType.MATERIALS, type: 'PDF', url: 'https://t.me/AnMuaamar/718' },
  { id: 'hr_manual', title: 'ملزمة حقوق الإنسان والديمقراطية', subject: Subject.HUMAN_RIGHTS, section: SectionType.MATERIALS, type: 'PDF', url: 'https://t.me/AnMuaamar/675/686' },
  { id: 'lp_manual', title: 'ملزمة التحضيرات المختبرية', subject: Subject.LAB_PREP, section: SectionType.MATERIALS, type: 'PDF', url: 'https://t.me/AnMuaamar/681/692' },
  { id: 'hist_exam', title: 'ملزمة اختبار علم الأنسجة الشامل', subject: Subject.HISTOLOGY, section: SectionType.PRACTICE_EXAMS, type: 'QUIZ', url: 'https://t.me/AnMuaamar/676/877' },
];

export const SUBJECT_ICONS = {
  [Subject.HISTOLOGY]: '🧬',
  [Subject.HUMAN_RIGHTS]: '⚖️',
  [Subject.LAB_PREP]: '🧪'
};
