import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'microbes.json');
const rawDB = fs.readFileSync(DB_PATH, 'utf8');
const microbes = JSON.parse(rawDB);

const medicalData = {
  "variola-virus": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Viral Capillary Endothelial Infection",
          mechanism: "เชื้อไวรัส Variola แพร่ผ่านกระแสเลือด (Secondary viremia) เข้าสู่ Capillary endothelial cells ของชั้น Dermis ทำให้หลอดเลือดฝอยอักเสบ บวมน้ำ และเม็ดเลือดขาวแทรกซึม ก่อรอยโรคที่ผิวหนังแบบระยะเดียวกันทั้งหมด (Synchronous rash)",
          desc: "เชื้อไวรัส Variola แพร่ผ่านกระแสเลือด (Secondary viremia) เข้าสู่ Capillary endothelial cells ของชั้น Dermis ทำให้หลอดเลือดฝอยอักเสบ บวมน้ำ และเม็ดเลือดขาวแทรกซึม ก่อรอยโรคที่ผิวหนังแบบระยะเดียวกันทั้งหมด (Synchronous rash)"
        },
        {
          name: "SPICE (Smallpox Inhibitor of Complement Enzymes)",
          mechanism: "โปรตีนยับยั้ง Complement cascade โดยจับกับ C3b และ C4b ขัดขวางการเกิด Opsonization และ Membrane Attack Complex (MAC) ช่วยให้ไวรัสเพิ่มจำนวนในเนื้อเยื่อได้อย่างรวดเร็ว",
          desc: "โปรตีนยับยั้ง Complement cascade โดยจับกับ C3b และ C4b ขัดขวางการเกิด Opsonization และ Membrane Attack Complex (MAC) ช่วยให้ไวรัสเพิ่มจำนวนในเนื้อเยื่อได้อย่างรวดเร็ว"
        },
        {
          name: "Reticular Colliquation & Ballooning Degeneration",
          mechanism: "Keratinocytes ในชั้น Stratum spinosum บวมพองและแตกสลาย กลายเป็นโพรงตุ่มน้ำหลายห้อง (Multilocular vesicle) ที่มีรอยบุ๋มตรงกลาง (Umbilication) ก่อนที่ Neutrophils จะหลั่งเข้ามากลายเป็น Pustule",
          desc: "Keratinocytes ในชั้น Stratum spinosum บวมพองและแตกสลาย กลายเป็นโพรงตุ่มน้ำหลายห้อง (Multilocular vesicle) ที่มีรอยบุ๋มตรงกลาง (Umbilication) ก่อนที่ Neutrophils จะหลั่งเข้ามากลายเป็น Pustule"
        }
      ],
      immuneEvasion: [
        "สร้าง Chemokine-binding proteins และ Soluble cytokine receptor homologs (เช่น vCCI, vCKBP) ดักจับ IFN-gamma, TNF-alpha และ IL-1beta ขัดขวางการส่งสัญญาณเตือนภูมิคุ้มกัน",
        "ยับยั้ง Apoptosis ของเซลล์โฮสต์ ทำให้ไวรัสสามารถใช้โรงงานภายในเซลล์สร้างอนุภาคไวรัสใหม่ได้ต่อเนื่อง"
      ],
      transmission: "ละอองฝอยทางเดินหายใจ (Respiratory droplets) จากการสัมผัสใกล้ชิดหน้าต่อหน้า และการสัมผัสสะเก็ดแผลหรือเสื้อผ้า/ผ้าปูที่นอนที่ปนเปื้อนเชื้อ"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Tzanck Smear หรือ Giemsa stain จากก้นตุ่มแผล: พบ Guarnieri inclusion bodies (ก้อน Eosinophilic/B-type inclusions ขนาดใหญ่ในไซโตพลาสซึม); Electron Microscopy พบอนุภาคไวรัสรูปทรงอิฐ (Brick-shaped virions ขนาด ~300x200x100 nm)",
      stains: [
        "Tzanck Smear / ชิ้นเนื้อ: พบ Guarnieri inclusion bodies (ก้อน Eosinophilic inclusions ขนาดใหญ่ใน Cytoplasm)",
        "Electron Microscopy จากของเหลวในตุ่ม: พบอนุภาคไวรัสรูปทรงอิฐ (Brick-shaped virions) ขนาดใหญ่ ~300 nm"
      ],
      culture: [
        "Real-time PCR (Orthopoxvirus species-specific PCR): Gold standard มีความไวและความจำเพาะสูงสุดในการยืนยันสายพันธุ์",
        "Chorioallantoic Membrane (CAM) ของไข่ไก่ฟัก: เกิดรอยโรค Pocks สีขาวนวล นูน ทึบแสง ขนาดสม่ำเสมอกันที่ 35-37°C",
        "ระดับความปลอดภัยทางชีวภาพ: BSL-4 (Category A Bioterrorism Agent) ห้ามเพาะเลี้ยงในห้องแล็บทั่วไป"
      ],
      biochemical: [
        "CBC: Leukopenia ร่วมกับ Relative lymphocytosis ในระยะแรก ก่อนเปลี่ยนเป็น Leukocytosis ในระยะ Pustular",
        "Serology: IgM Capture ELISA หรือ Neutralization test สำหรับการตรวจยืนยันทางระบาดวิทยา"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Tecovirimat (TPOXX): ยาต้านไวรัสอันดับหนึ่งที่ผ่านการรับรองจาก FDA ยับยั้งโปรตีน VP37 envelope protein ขัดขวางการหลุดออกจากเซลล์ (Egress) ขนาดยาในผู้ใหญ่ 600 mg รับประทานวันละ 2 ครั้ง หลังอาหารที่มีไขมัน นาน 14 วัน (หรือ IV 200 mg q12h)",
      alternative: "Brincidofovir (TEMBEXA - Oral lipid-conjugate prodrug ของ Cidofovir ขนาดยา 200 mg สัปดาห์ละครั้ง รวม 2 สัปดาห์ ปลอดภัยต่อไตมากกว่า Cidofovir) หรือ IV Cidofovir (ร่วมกับ Oral Probenecid และสารน้ำ IV เพื่อลดพิษต่อไต)",
      resistance: "การป้องกันและการควบคุมการระบาด: ฉีดวัคซีนป้องกัน Smallpox (JYNNEOS / ACAM2000) ภายใน 4 วันหลังสัมผัสเชื้อสามารถป้องกันการเกิดโรคหรือลดความรุนแรงได้อย่างมีนัยสำคัญ; ระวังการติดเชื้อแบคทีเรียซ้ำซ้อนที่ผิวหนัง (Secondary bacterial infection จาก S. aureus และ S. pyogenes)"
    }
  },

  "staphylococcus-aureus": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Protein A (SpA)",
          mechanism: "จับกับส่วน Fc ของ IgG ในทิศทางกลับหัว ขัดขวางไม่ให้ Fab จับกับเชื้อ ทำให้ระบบ Complement และ Macrophages ไม่สามารถทำ Opsonization หรือ Phagocytosis ได้",
          desc: "จับกับส่วน Fc ของ IgG ในทิศทางกลับหัว ขัดขวางไม่ให้ Fab จับกับเชื้อ ทำให้ระบบ Complement และ Macrophages ไม่สามารถทำ Opsonization หรือ Phagocytosis ได้"
        },
        {
          name: "Exfoliative Toxins A & B",
          mechanism: "เอนไซม์ Serine protease จำเพาะที่ย่อยสลาย Desmoglein-1 ในชั้น Stratum granulosum ของผิวหนังกำพร้า ทำให้เกิดการแยกชั้นของเซลล์ผิวหนัง ก่อให้เกิด Bullous impetigo และ Staphylococcal Scalded Skin Syndrome (SSSS โดยที่ Nikolsky sign positive)",
          desc: "เอนไซม์ Serine protease จำเพาะที่ย่อยสลาย Desmoglein-1 ในชั้น Stratum granulosum ของผิวหนังกำพร้า ทำให้เกิดการแยกชั้นของเซลล์ผิวหนัง ก่อให้เกิด Bullous impetigo และ Staphylococcal Scalded Skin Syndrome (SSSS โดยที่ Nikolsky sign positive)"
        },
        {
          name: "Panton-Valentine Leukocidin (PVL) & Alpha-toxin",
          mechanism: "PVL เป็น Cytotoxin เจาะรูทำลายเซลล์เม็ดเลือดขาว Neutrophils ทำให้เกิดฝีหนองลึกและเนื้อตายรุนแรง (Necrotizing fasciitis/pneumonia มักพบใน CA-MRSA); Alpha-toxin เจาะรูบนเยื่อหุ้มเซลล์ทำให้เกิด Tissue necrosis",
          desc: "PVL เป็น Cytotoxin เจาะรูทำลายเซลล์เม็ดเลือดขาว Neutrophils ทำให้เกิดฝีหนองลึกและเนื้อตายรุนแรง (Necrotizing fasciitis/pneumonia มักพบใน CA-MRSA); Alpha-toxin เจาะรูบนเยื่อหุ้มเซลล์ทำให้เกิด Tissue necrosis"
        },
        {
          name: "Coagulase & Clumping Factor",
          mechanism: "เปลี่ยน Fibrinogen ในพลาสมาให้กลายเป็น Fibrin mesh ล้อมรอบตัวเชื้อ สร้างเป็นกำแพงฝีหนอง (Abscess wall) ขัดขวางยาปฏิชีวนะและเซลล์ภูมิคุ้มกัน",
          desc: "เปลี่ยน Fibrinogen ในพลาสมาให้กลายเป็น Fibrin mesh ล้อมรอบตัวเชื้อ สร้างเป็นกำแพงฝีหนอง (Abscess wall) ขัดขวางยาปฏิชีวนะและเซลล์ภูมิคุ้มกัน"
        }
      ],
      immuneEvasion: [
        "สร้างเอนไซม์ Catalase สลาย Hydrogen peroxide (H2O2) จากการทำปฏิกิริยา Respiratory burst ของ Neutrophils",
        "สร้าง Golden carotenoid pigment (Staphyloxanthin) ทำหน้าที่เป็นสารต้านอนุมูลอิสระดูดซับ Reactive Oxygen Species (ROS)",
        "สร้าง Biofilm บนพื้นผิววัสดุแปลกปลอม (Prosthetic joints, Central lines, Pacemakers)"
      ],
      transmission: "การสัมผัสโดยตรง (Direct contact) กับแผลหรือสะเก็ด, แผลถลอก/แมลงกัดที่เป็นทางเปิดให้เชื้อประจำถิ่นบุกรุก, และการแพร่กระจายผ่านมือบุคลากรทางการแพทย์ในโรงพยาบาล"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Gram Stain จากหนองหรือเนื้อเยื่อ: พบ Gram-positive cocci in clusters (รูปกลมติดสีม่วงเข้มเรียงตัวเป็นพวงคล้ายพวงองุ่น) ปะปนกับเซลล์เม็ดเลือดขาว Neutrophils จำนวนมาก",
      stains: [
        "Gram Stain: Gram-positive spherical cocci in grape-like clusters (พวงองุ่นสีม่วงเข้ม)",
        "หนองใต้สะเก็ดแผลพบ Neutrophils และเซลล์แบคทีเรียถูกจับกินภายในเซลล์"
      ],
      culture: [
        "Sheep Blood Agar: โคโลนีกลม นูน ผิวเรียบ สีเหลืองทอง (Golden-yellow colonies) ล้อมรอบด้วย Beta-hemolysis วงใสชัดเจน",
        "Mannitol Salt Agar (MSA): อาหารคัดเลือกทนเกลือ 7.5% NaCl และ Ferment mannitol เปลี่ยนอาหารจากสีแดงเป็นสีเหลืองสด",
        "CHROMagar MRSA: โคโลนีเปลี่ยนเป็นสีม่วงชมพู (Mauve) ภายใน 24 ชม. สำหรับคัดกรอง MRSA"
      ],
      biochemical: [
        "Catalase Test: Positive (+) เกิดฟองก๊าซออกซิเจนทันทีเมื่อหยด H2O2 (แยกจาก Streptococcus ซึ่งเป็น Negative)",
        "Coagulase Test (Tube & Slide): Positive (+) ตกตะกอน Fibrin clot ภายใน 4 ชม. (Gold standard แยกจาก CoNS เช่น S. epidermidis)",
        "DNAse Test: Positive (+) ย่อยสลาย DNA ในอาหารเลี้ยงเชื้อ",
        "Novobiocin Susceptibility: Sensitive (แยกจาก S. saprophyticus ซึ่งดื้อต่อ Novobiocin)"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "MSSA (Methicillin-Susceptible): IV Cefazolin 2 g q8h หรือ IV Cloxacillin / Nafcillin 2 g q4h; อาการไม่รุนแรง (Outpatient): Oral Dicloxacillin 500 mg qid หรือ Cephalexin 500 mg qid นาน 7-10 วัน; MRSA (Methicillin-Resistant): IV Vancomycin (15-20 mg/kg q8-12h ปรับตาม eGFR และ TDM AUC/MIC 400-600) หรือ IV Daptomycin (6-10 mg/kg q24h *ห้ามใช้ในปอดอักเสบเด็ดขาด*)",
      alternative: "Oral MRSA Outpatient (แผลผิวหนังและเนื้อเยื่ออ่อน): Oral Trimethoprim-Sulfamethoxazole (TMP-SMX 1-2 DS tabs bid) หรือ Oral Doxycycline (100 mg bid) หรือ Oral Clindamycin (300-450 mg tid เฉพาะกรณี D-test negative); Severe MRSA Inpatient: Ceftaroline (5th gen cephalosporin 600 mg q12h) หรือ Linezolid (600 mg q12h)",
      resistance: "กลไกการดื้อยาสำคัญ: MRSA เกิดจากการมียีน mecA บน Staphylococcal Cassette Chromosome (SCCmec) ซึ่งถอดรหัสเป็น Penicillin-Binding Protein 2a (PBP2a) ที่มีแรงจับกับยากลุ่ม Beta-lactams เกือบทุกชนิดต่ำมาก; ห้ามใช้ Cephalosporins รุ่น 1-4 หรือ Carbapenems กับ MRSA เด็ดขาด! และหากพบฝีหนอง (Abscess) การระบายหนอง (Incision & Drainage: I&D) คือหัวใจสำคัญอันดับหนึ่งของการรักษา"
    }
  },

  "bacillus-anthracis": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Poly-D-Glutamic Acid Capsule",
          mechanism: "แคปซูลกรดอะมิโนโพลี-ดี-กลูตามิก (ถอดรหัสบนพลาสมิด pXO2) ไม่กระตุ้นการสร้างแอนติบอดีและป้องกันการจับกินของ Phagocytes ได้อย่างสมบูรณ์",
          desc: "แคปซูลกรดอะมิโนโพลี-ดี-กลูตามิก (ถอดรหัสบนพลาสมิด pXO2) ไม่กระตุ้นการสร้างแอนติบอดีและป้องกันการจับกินของ Phagocytes ได้อย่างสมบูรณ์"
        },
        {
          name: "Protective Antigen (PA - 83 kDa)",
          mechanism: "โปรตีนแกนหลัก (ถอดรหัสบนพลาสมิด pXO1) จับกับ Anthrax Toxin Receptors (CMG2/TEM8) บนผิวเซลล์โฮสต์ ถูก Furin ตัดเหลือ PA63 รวมตัวเป็น Heptamer prepore เพื่อนำพา Edema Factor และ Lethal Factor เข้าสู่เซลล์",
          desc: "โปรตีนแกนหลัก (ถอดรหัสบนพลาสมิด pXO1) จับกับ Anthrax Toxin Receptors (CMG2/TEM8) บนผิวเซลล์โฮสต์ ถูก Furin ตัดเหลือ PA63 รวมตัวเป็น Heptamer prepore เพื่อนำพา Edema Factor และ Lethal Factor เข้าสู่เซลล์"
        },
        {
          name: "Edema Factor (EF - 89 kDa)",
          mechanism: "เอนไซม์ Calmodulin-dependent Adenylate Cyclase เปลี่ยน ATP เป็น cAMP ในปริมาณมหาศาล ทำให้ไอออนและน้ำรั่วออกจากเซลล์ ก่อให้เกิดอาการบวมน้ำรุนแรงแบบกดไม่บุ๋ม (Extensive gelatinous non-pitting edema) รอบแผล",
          desc: "เอนไซม์ Calmodulin-dependent Adenylate Cyclase เปลี่ยน ATP เป็น cAMP ในปริมาณมหาศาล ทำให้ไอออนและน้ำรั่วออกจากเซลล์ ก่อให้เกิดอาการบวมน้ำรุนแรงแบบกดไม่บุ๋ม (Extensive gelatinous non-pitting edema) รอบแผล"
        },
        {
          name: "Lethal Factor (LF - 90 kDa)",
          mechanism: "เอนไซม์ Zinc metalloprotease ตัดทำลาย Mitogen-Activated Protein Kinase Kinases (MAPKK / MEK 1-7) ยับยั้งการส่งสัญญาณภายในเซลล์ กระตุ้น Macrophage lysis และหลั่งสารอักเสบทำให้เกิดเนื้อตายดำ (Black necrotic eschar)",
          desc: "เอนไซม์ Zinc metalloprotease ตัดทำลาย Mitogen-Activated Protein Kinase Kinases (MAPKK / MEK 1-7) ยับยั้งการส่งสัญญาณภายในเซลล์ กระตุ้น Macrophage lysis และหลั่งสารอักเสบทำให้เกิดเนื้อตายดำ (Black necrotic eschar)"
        }
      ],
      immuneEvasion: [
        "สปอร์ทนทานต่อความร้อน ความแห้งแล้ง และสารเคมี สามารถตกค้างในดินและขนสัตว์ได้นานหลายสิบปี",
        "EF และ LF ยับยั้ง Chemotaxis และ Phagocytosis ของ Neutrophils อย่างสิ้นเชิง"
      ],
      transmission: "การสัมผัสโดยตรงของสปอร์กับผิวหนังที่มีรอยถลอก (Cutaneous anthrax 95% ของเคส), การสูดดมสปอร์จากขนสัตว์/หนังสัตว์ (Inhalational / Woolsorter's disease), หรือการบริโภคเนื้อสัตว์ป่วย (Gastrointestinal anthrax)"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Gram Stain จากของเหลวใต้ขอบแผลหรือเลือด: พบ Large Gram-positive bacilli with square ends arranged in long chains (แท่งเหลี่ยมหัวท้ายตัดคล้ายตู้รถไฟ boxcar ต่อกันเป็นสายยาว) ย้อมสปอร์ด้วยวิธี Schaeffer-Fulton พบ Oval central/subterminal spores (ไม่พองขยายตัวเซลล์)",
      stains: [
        "Gram Stain: Large Gram-positive rods with blunt ends in chains ('Boxcar' appearance)",
        "McFadyean capsule stain: ย้อมด้วย Polychrome methylene blue พบ Pink/purple capsule ล้อมรอบตัวแบคทีเรียสีน้ำเงิน"
      ],
      culture: [
        "Sheep Blood Agar: โคโลนีสีเทาขาว ผิวด้านคล้ายกระจกฝ้า ขอบหยักไม่สม่ำเสมอยื่นคล้ายเส้นผมหรือหัวนางเมดูซา (Medusa-head colonies) และที่สำคัญคือ 'Non-hemolytic (Gamma-hemolytic)' ช่วยแยกจาก B. cereus",
        "Gelatin Stab: เกิดการย่อยสลายเจลาตินเป็นรูปต้นสนกลับหัว (Inverted fir-tree pattern)",
        "String of Pearls Test: เมื่อเลี้ยงบนอาหารผสม Penicillin 0.05-0.5 U/mL เซลล์จะบวมกลมเรียงต่อกันคล้ายสายสร้อยไข่มุก"
      ],
      biochemical: [
        "Motility Test: NON-MOTILE (ไม่เคลื่อนที่ ซึ่งเป็นจุดสำคัญมากในการแยกจาก B. cereus ที่เคลื่อนที่ได้)",
        "Catalase Test: Positive (+)",
        "PCR: ตรวจหายีนจำเพาะบนพลาสมิด pXO1 (pagA) และ pXO2 (capC)"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Cutaneous Anthrax (ไม่รุนแรง / ไม่มีบวมที่ศีรษะและคอ): Oral Ciprofloxacin 500 mg q12h หรือ Oral Doxycycline 100 mg q12h นาน 7-10 วัน (แต่หากเกิดจากการก่อการร้ายทางชีวภาพต้องให้นาน 60 วัน); Systemic / Inhalational / Meningeal / Severe Cutaneous with Edema: IV Ciprofloxacin (400 mg q8h) PLUS Protein Synthesis Inhibitor (IV Clindamycin 900 mg q8h หรือ Linezolid 600 mg q12h เพื่อหยุดการสร้างสารพิษ) PLUS ยาตัวที่สาม (เช่น Meropenem 2 g q8h หรือ Ampicillin) นานอย่างน้อย 14 วัน แล้วเปลี่ยนเป็นยากินจนครบ 60 วัน",
      alternative: "Levofloxacin 750 mg IV/PO q24h หรือ Moxifloxacin 400 mg IV/PO q24h; สตรีมีครรภ์: Ciprofloxacin ถือเป็นยาแนะนำอันดับหนึ่งเนื่องจากประโยชน์เหนือกว่าความเสี่ยง",
      resistance: "แอนติท็อกซินเสริมการรักษา (Adjunctive Antitoxins): ในผู้ป่วย Systemic anthrax แนะนำให้แอนติบอดีลบล้างพิษร่วมด้วย เช่น Anthrax Immune Globulin Intravenous (AIGIV) หรือ Raxibacumab / Obiltoxaximab (Monoclonal antibodies ต่อ Protective Antigen); ห้ามกรีดหรือผ่าตัดแผล Eschar เด็ดขาด (Contraindicated surgical debridement) เพราะจะทำให้เชื้อและสารพิษแพร่กระจายเข้าสู่กระแสเลือดรวดเร็วขึ้น!"
    }
  },

  "treponema-pallidum": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Periplasmic Endoflagella & Corkscrew Motility",
          mechanism: "แฟลกเจลลาซ่อนตัวอยู่ภายใน Periplasmic space ระหว่างชั้นเยื่อหุ้มเซลล์ด้านในและนอก หมุนตัวทำให้สไปโรขีตเคลื่อนที่แบบควงสว่าน (Corkscrew motility) ทะลวงผ่านรอยต่อเซลล์เยื่อบุผิวและเจาะแทรกซึมเข้าสู่เนื้อเยื่อชั้นลึกได้อย่างรวดเร็ว",
          desc: "แฟลกเจลลาซ่อนตัวอยู่ภายใน Periplasmic space ระหว่างชั้นเยื่อหุ้มเซลล์ด้านในและนอก หมุนตัวทำให้สไปโรขีตเคลื่อนที่แบบควงสว่าน (Corkscrew motility) ทะลวงผ่านรอยต่อเซลล์เยื่อบุผิวและเจาะแทรกซึมเข้าสู่เนื้อเยื่อชั้นลึกได้อย่างรวดเร็ว"
        },
        {
          name: "Endothelial Adherence & Obliterative Endarteritis",
          mechanism: "โปรตีน Tp0155 และ Tp0483 ยึดเกาะกับ Fibronectin และ Laminin บนผิวเซลล์เยื่อบุหลอดเลือด เหนี่ยวนำให้เกิดการอักเสบของผนังหลอดเลือดแดงขนาดเล็ก (Endarteritis obliterans) ร่วมกับ Perivascular plasma cell infiltration ทำให้หลอดเลือดตีบตัน เนื้อเยื่อขาดเลือดตายกลายเป็นแผลริมแข็ง (Hard chancre) และกัมมา (Gumma)",
          desc: "โปรตีน Tp0155 และ Tp0483 ยึดเกาะกับ Fibronectin และ Laminin บนผิวเซลล์เยื่อบุหลอดเลือด เหนี่ยวนำให้เกิดการอักเสบของผนังหลอดเลือดแดงขนาดเล็ก (Endarteritis obliterans) ร่วมกับ Perivascular plasma cell infiltration ทำให้หลอดเลือดตีบตัน เนื้อเยื่อขาดเลือดตายกลายเป็นแผลริมแข็ง (Hard chancre) และกัมมา (Gumma)"
        },
        {
          name: "Hyaluronidase Production",
          mechanism: "ย่อยสลาย Hyaluronic acid ใน Extracellular matrix ของโฮสต์ ช่วยให้เชื้อแทรกซึมผ่านเนื้อเยื่อเกี่ยวพันเข้าสู่หลอดเลือดและระบบน้ำเหลืองกระจายไปทั่วร่างกายตั้งแต่ระยะแรก",
          desc: "ย่อยสลาย Hyaluronic acid ใน Extracellular matrix ของโฮสต์ ช่วยให้เชื้อแทรกซึมผ่านเนื้อเยื่อเกี่ยวพันเข้าสู่หลอดเลือดและระบบน้ำเหลืองกระจายไปทั่วร่างกายตั้งแต่ระยะแรก"
        }
      ],
      immuneEvasion: [
        "มี Outer Membrane Proteins บนผิวน้อยมากผิดปกติ (เปรียบเสมือน 'Stealth Pathogen') ทำให้แอนติบอดีตรวจจับแทบไม่ได้",
        "ห่อหุ้มเซลล์ด้วยสารเคลือบ Fibronectin ของโฮสต์เพื่อพรางตัวจากระบบภูมิคุ้มกัน"
      ],
      transmission: "การมีเพศสัมพันธ์โดยตรง (Sexual contact) สัมผัสกับแผล Chancre, Condyloma lata หรือผื่นผิวหนัง, การส่งผ่านจากมารดาสู่ทารกในครรภ์ผ่านรก (Congenital syphilis), และการรับเลือดที่ปนเปื้อน"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Darkfield Microscopy จากสารคัดหลั่งแผลริมแข็ง Chancre: พบเกลียวสไปโรขีตเรียวยาว (6-15 เกลียว) ขยับเคลื่อนที่หมุนตัวแบบควงสว่านอย่างว่องไว; Direct Fluorescent Antibody (DFA-TP): ตรวจพบเชื้อติดแอนติบอดีเรืองแสง; Silver Impregnation Stain (Warthin-Starry หรือ Steiner): ย้อมชิ้นเนื้อติดสีดำ",
      stains: [
        "Darkfield Microscopy: Corkscrew motility of delicate slender spirochetes",
        "DFA-TP (Direct Fluorescent Antibody for T. pallidum): จำเพาะสูงมากจาก exudate",
        "Warthin-Starry Silver Stain: ตรวจพบสไปโรขีตสีดำขดเป็นเกลียวในเนื้อเยื่อ"
      ],
      culture: [
        "ไม่สามารถเพาะเลี้ยงบนอาหารเลี้ยงเชื้อสังเคราะห์ทั่วไปได้ (Cannot be cultured in vitro) ต้องเลี้ยงในลูกอัณฑะกระต่าย (Rabbit infectivity test: RIT) เพื่อการวิจัยเท่านั้น",
        "การวินิจฉัยหลักในเวชปฏิบัติจึงใช้ Serology (การตรวจเลือดทางน้ำเหลือง)"
      ],
      biochemical: [
        "Non-Treponemal Tests (คัดกรองและติดตามผลการรักษา): VDRL และ RPR วัดแอนติบอดีต่อ Cardiolipin-lecithin-cholesterol antigen (ผลบวกบ่งชี้ active disease; การรักษาได้ผลเมื่อ Titer ลดลง >= 4 เท่า หรือ 2 dilutions ภายใน 6-12 เดือน)",
        "Treponemal Tests (ยืนยันการติดเชื้อ): FTA-ABS, TP-PA, EIA/CIA, TPHA (ผลบวกตลอดชีวิต แม้รักษาหายแล้ว)",
        "ตรวจ CSF ในรายที่สงสัย Neurosyphilis: VDRL ใน CSF (จำเพาะสูงมาก), เม็ดเลือดขาวใน CSF > 5 cells/uL, โปรตีนสูง"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Primary, Secondary, Early Latent (< 1 ปี): Benzathine Penicillin G 2.4 ล้านยูนิต ฉีดเข้ากล้ามเนื้อ (IM) ครั้งเดียว (Single dose); Late Latent (> 1 ปี หรือไม่ทราบระยะ), Tertiary Syphilis (Cardiovascular / Gumma): Benzathine Penicillin G 2.4 ล้านยูนิต IM สัปดาห์ละครั้ง ติดต่อกัน 3 สัปดาห์ (รวม 7.2 ล้านยูนิต); Neurosyphilis / Ocular / Otic Syphilis: Aqueous Crystalline Penicillin G 18-24 ล้านยูนิตต่อวัน ทางหลอดเลือดดำ (IV) โดยให้ 3-4 ล้านยูนิต ทุก 4 ชม. หรือหยดต่อเนื่อง นาน 10-14 วัน",
      alternative: "ผู้ป่วยแพ้ Penicillin (และไม่ได้ตั้งครรภ์): Oral Doxycycline 100 mg วันละ 2 ครั้ง นาน 14 วัน (สำหรับระยะแรก) หรือนาน 28 วัน (สำหรับระยะ Late latent) หรือ Oral Tetracycline 500 mg วันละ 4 ครั้ง หรือ Ceftriaxone 1-2 g IV/IM ต่อวัน นาน 10-14 วัน; *ข้อบังคับในสตรีมีครรภ์*: หากแพ้ Penicillin ต้องทำ Penicillin Desensitization แล้วรักษาด้วย Benzathine Penicillin G เท่านั้น! ห้ามใช้ Doxycycline หรือยาอื่นแทนเด็ดขาด",
      resistance: "ข้อควรระวังสำคัญ (Jarisch-Herxheimer Reaction): ผู้ป่วยอาจมีไข้สูง หนาวสั่น ปวดกล้ามเนื้อ ปวดศีรษะ และความดันตกชั่วคราว เกิดขึ้นภายใน 2-24 ชั่วโมงหลังได้รับ Penicillin เข็มแรก เกิดจากการที่สไปโรขีตถูกทำลายพร้อมกันจำนวนมากและปลดปล่อย Lipoproteins กระตุ้น Cytokine release ให้การรักษาตามอาการด้วยยาลดไข้พาราเซตามอล ไม่ใช่การแพ้ยาและไม่ต้องหยุดยาปฏิชีวนะ"
    }
  },

  "varicella-zoster": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Viral Glycoproteins (gB, gC, gE, gH, gI)",
          mechanism: "ไกลโคโปรตีนบนผิวไวรัส (โดยเฉพาะ gE/gI complex) จับกับ Cellular receptors (Insulin-Degrading Enzyme และ Mannose-6-phosphate receptor) ช่วยให้ไวรัสหลอมรวมเยื่อหุ้มและแทรกซึมเข้าสู่เซลล์เยื่อบุผิวและเซลล์ประสาท",
          desc: "ไกลโคโปรตีนบนผิวไวรัส (โดยเฉพาะ gE/gI complex) จับกับ Cellular receptors (Insulin-Degrading Enzyme และ Mannose-6-phosphate receptor) ช่วยให้ไวรัสหลอมรวมเยื่อหุ้มและแทรกซึมเข้าสู่เซลล์เยื่อบุผิวและเซลล์ประสาท"
        },
        {
          name: "Neuronal Latency & Retrograde Axonal Transport",
          mechanism: "หลังการติดเชื้ออีสุกอีใสระยะแรก ไวรัสเคลื่อนที่ย้อนกลับทางเส้นใยประสาทรับความรู้สึก (Retrograde axonal transport) ไปฝังตัวแฝงแบบ Latency ตลอดชีวิตใน Dorsal Root Ganglia (DRG) หรือ Trigeminal/Cranial nerve ganglia เมื่อภูมิคุ้มกัน CMI ลดลง จะแบ่งตัวย้อนกลับมาก่อโรคงูสวัดตามแนว Dermatome",
          desc: "หลังการติดเชื้ออีสุกอีใสระยะแรก ไวรัสเคลื่อนที่ย้อนกลับทางเส้นใยประสาทรับความรู้สึก (Retrograde axonal transport) ไปฝังตัวแฝงแบบ Latency ตลอดชีวิตใน Dorsal Root Ganglia (DRG) หรือ Trigeminal/Cranial nerve ganglia เมื่อภูมิคุ้มกัน CMI ลดลง จะแบ่งตัวย้อนกลับมาก่อโรคงูสวัดตามแนว Dermatome"
        },
        {
          name: "Syncytia & Multinucleated Giant Cell Formation",
          mechanism: "ทำให้เซลล์ Keratinocytes หลอมรวมกันกลายเป็น Multinucleated giant cells และเกิด Ballooning degeneration จนเกิดตุ่มน้ำใสบนฐานผื่นแดงคล้ายหยดน้ำค้างบนกลีบกุหลาบ ('Dewdrops on a rose petal')",
          desc: "ทำให้เซลล์ Keratinocytes หลอมรวมกันกลายเป็น Multinucleated giant cells และเกิด Ballooning degeneration จนเกิดตุ่มน้ำใสบนฐานผื่นแดงคล้ายหยดน้ำค้างบนกลีบกุหลาบ ('Dewdrops on a rose petal')"
        }
      ],
      immuneEvasion: [
        "ยับยั้งการแสดงออกของ MHC Class I บนผิวเซลล์ที่ติดเชื้อ ทำให้ Cytotoxic T cells (CD8+) ตรวจจับไม่พบ",
        "ขัดขวางวิถีสัญญาณของ Interferon-alpha และ Interferon-gamma ชะลอการตอบสนองของภูมิคุ้มกันโดยกำเนิด"
      ],
      transmission: "ละอองฝอยทางเดินหายใจ (Airborne droplets) และการสัมผัสโดยตรงกับน้ำเหลืองจากตุ่มน้ำใสที่มีอนุภาคไวรัสความเข้มข้นสูง"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Tzanck Smear จากก้นตุ่มน้ำใสที่เพิ่งผุด (ขูดเซลล์จากก้นแผลย้อม Wright หรือ Giemsa stain): พบ Multinucleated Giant Cells และเซลล์เยื่อบุผิวบวมพอง (Ballooning degeneration) ร่วมกับ Cowdry A intranuclear inclusion bodies (แยกกลุ่ม Herpesviridae ออกจากไวรัสอื่น)",
      stains: [
        "Tzanck Smear: Multinucleated giant cells with molding of nuclei (Cowdry A inclusions)",
        "Direct Fluorescent Antibody (DFA): ตรวจจับ VZV-specific glycoproteins เร็วและแม่นยำ"
      ],
      culture: [
        "VZV Real-time PCR จากน้ำในตุ่มน้ำใสหรือสะเก็ด: เป็นวิธีที่ไวที่สุด (Sensitivity > 95%) และเป็น Gold standard ในการตรวจยืนยัน",
        "Viral Culture: เพาะบน Human embryonic lung fibroblasts (เจริญช้า 1-2 สัปดาห์ ไว้น้อยกว่า HSV)",
        "CSF Analysis ในผู้ป่วยสงสัย VZV Encephalitis/Meningitis: ตรวจพบ VZV DNA ด้วย PCR และระดับแอนติบอดีจำเพาะ"
      ],
      biochemical: [
        "Serology: VZV IgG (ตรวจภูมิคุ้มกันเดิมหรือก่อนให้วัคซีน) และ IgM (บ่งชี้การติดเชื้อเฉียบพลัน)",
        "VZV Ophthalmicus: ต้องย้อม Fluorescein ตรวจตาด้วย Slit lamp เสมอเพื่อดู Pseudodendritic keratitis"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Herpes Zoster (งูสวัดในผู้ใหญ่): Oral Valacyclovir 1,000 mg วันละ 3 ครั้ง (TID) นาน 7 วัน (เป็นยาอันดับหนึ่งเนื่องจาก Bioavailability สูงกว่า Acyclovir 3-5 เท่า) หรือ Oral Famciclovir 500 mg TID นาน 7 วัน หรือ Oral Acyclovir 800 mg วันละ 5 ครั้ง นาน 7 วัน (ควรเริ่มยาภายใน 72 ชม. หลังผื่นขึ้น); Varicella (อีสุกอีใสในวัยรุ่น/ผู้ใหญ่/คนท้องไตรมาส 2-3): Oral Valacyclovir 1,000 mg TID นาน 5-7 วัน; Severe / Disseminated / Immunocompromised / VZV Encephalitis / Ramsay Hunt Syndrome: IV Acyclovir 10 mg/kg ทุก 8 ชม. นาน 10-14 วัน",
      alternative: "ผู้ป่วยที่ดื้อต่อ Acyclovir (Acyclovir-resistant จากยีน Thymidine Kinase กลายพันธุ์ พบบ่อยในผู้ป่วยเอดส์): IV Foscarnet 40 mg/kg ทุก 8 ชม. หรือ IV Cidofovir; การจัดการอาการปวดประสาทหลังเป็นงูสวัด (Post-Herpetic Neuralgia: PHN): Gabapentin, Pregabalin, หรือ Tricyclic Antidepressants (Amitriptyline)",
      resistance: "การป้องกันด้วยวัคซีน (Prevention & Prophylaxis): วัคซีนงูสวัดชนิด Recombinant (Shingrix - 2 เข็ม ห่างกัน 2-6 เดือน) แนะนำสำหรับผู้ใหญ่อายุ >= 50 ปี และผู้มีภูมิคุ้มกันบกพร่องอายุ >= 19 ปี มีประสิทธิภาพป้องกันสูงถึง 97%; การให้ VariZIG (Varicella-Zoster Immune Globulin) ภายใน 10 วันหลังสัมผัสเชื้อในผู้สัมผัสที่มีความเสี่ยงสูง (คนท้องที่ไม่มีภูมิ, ทารกแรกเกิด, ผู้ป่วยมะเร็ง)"
    }
  },

  "borrelia-burgdorferi": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "OspA to OspC Differential Expression",
          mechanism: "การปรับเปลี่ยนแอนติเจนบนผิว: ในทางเดินอาหารของเห็บจะแสดง Outer Surface Protein A (OspA) ยึดเกาะกับเซลล์เห็บ แต่เมื่อเห็บดูดเลือดอุ่นของคน จะสลับมาแสดง OspC เข้าสู่ต่อมน้ำลายของเห็บและหลั่งเข้าสู่ผิวหนังคน ช่วยให้เชื้อรอดพ้นจากการทำลายของระบบภูมิคุ้มกันในกระแสเลือด",
          desc: "การปรับเปลี่ยนแอนติเจนบนผิว: ในทางเดินอาหารของเห็บจะแสดง Outer Surface Protein A (OspA) ยึดเกาะกับเซลล์เห็บ แต่เมื่อเห็บดูดเลือดอุ่นของคน จะสลับมาแสดง OspC เข้าสู่ต่อมน้ำลายของเห็บและหลั่งเข้าสู่ผิวหนังคน ช่วยให้เชื้อรอดพ้นจากการทำลายของระบบภูมิคุ้มกันในกระแสเลือด"
        },
        {
          name: "VlsE Antigenic Variation",
          mechanism: "ระบบ VlsE (Variable major protein-like sequence, expressed) มีการสับเปลี่ยนชิ้นส่วนยีน (Gene cassette recombination) ตลอดเวลา ทำให้แอนติบอดีของโฮสต์ไม่สามารถกำจัดเชื้อได้ นำไปสู่การติดเชื้อเรื้อรัง (Chronic Lyme arthritis)",
          desc: "ระบบ VlsE (Variable major protein-like sequence, expressed) มีการสับเปลี่ยนชิ้นส่วนยีน (Gene cassette recombination) ตลอดเวลา ทำให้แอนติบอดีของโฮสต์ไม่สามารถกำจัดเชื้อได้ นำไปสู่การติดเชื้อเรื้อรัง (Chronic Lyme arthritis)"
        },
        {
          name: "Endoflagellar Motility & Tissue Infiltration",
          mechanism: "แฟลกเจลลาใน Periplasmic space ช่วยให้สไปโรขีตเคลื่อนที่ผ่าน Collagenous tissue และ Extracellular matrix เกิดการขยายวงของผื่น Erythema migrans แผ่ออกเป็นวงแหวนรูปเป้าตาวัว (Bull's-eye target lesion)",
          desc: "แฟลกเจลลาใน Periplasmic space ช่วยให้สไปโรขีตเคลื่อนที่ผ่าน Collagenous tissue และ Extracellular matrix เกิดการขยายวงของผื่น Erythema migrans แผ่ออกเป็นวงแหวนรูปเป้าตาวัว (Bull's-eye target lesion)"
        }
      ],
      immuneEvasion: [
        "ไม่มีสารพิษแบบ LPS หรือ Exotoxin แบบดั้งเดิม ความเสียหายของเนื้อเยื่อเกิดจากการตอบสนองทางอิมมูนของโฮสต์ (Immunopathology)",
        "จับกับ Complement Regulator-Acquiring Surface Proteins (CRASPs) เพื่อยับยั้ง Complement-mediated lysis"
      ],
      transmission: "การกัดของเห็บแข็งกวางสกุล Ixodes (Ixodes scapularis ทางตะวันออกของสหรัฐฯ, Ixodes pacificus ทางตะวันตก, Ixodes ricinus ในยุโรป) โดยเห็บต้องเกาะดูดเลือดนานอย่างน้อย 36-48 ชั่วโมงจึงจะแพร่เชื้อได้"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "การตรวจชิ้นเนื้อผิวหนังย้อมพิเศษ: Silver stain (Warthin-Starry หรือ Steiner) หรือ Giemsa stain พบสไปโรขีตเกลียวคลื่นหลวมๆ (Loose wavy spirochetes ขนาด 10-30 x 0.2-0.5 um) ในชั้น Dermis (แต่ตรวจพบได้ยากมาก ไม่แนะนำให้ใช้เป็นเกณฑ์หลักในการตรวจผู้ป่วยทั่วไป)",
      stains: [
        "Warthin-Starry Silver Stain: ตรวจพบ Loose irregular coils ของ Borrelia ในขอบผื่น",
        "Giemsa / Wright stain: ย้อมสไปโรขีตติดสีน้ำเงินอมม่วง"
      ],
      culture: [
        "Barbour-Stoenner-Kelly (BSK-II) Medium: อาหารเหลวจำเพาะเพาะเชื้อสไปโรขีตที่ 33°C (ใช้เวลาเพาะ 2-4 สัปดาห์ ใช้ในงานวิจัยเท่านั้น ไม่ใช้ในงานรูทีน)",
        "เกณฑ์การวินิจฉัย Early Localized Lyme: หากตรวจพบผื่น Erythema migrans ร่วมกับประวัติเสี่ยง ถือว่าวินิจฉัยได้ทันทีโดย 'ไม่ต้องรอผลเลือด Serology' เพราะแอนติบอดีในระยะแรกยังไม่ขึ้น (Window period)"
      ],
      biochemical: [
        "Two-Tiered Serology Testing (CDC Standard Protocol): ชั้นที่ 1 ตรวจ EIA หรือ IFA (Enzyme Immunoassay) หากผลเป็นลบ ไม่ต้องตรวจต่อ; หากผลบวกหรือก้ำกึ่ง ให้ตรวจชั้นที่ 2 ด้วย Western Blot (ตรวจ IgM ภายใน 4 สัปดาห์แรก และ IgG หลัง 4 สัปดาห์) หรือตรวจด้วย Second EIA (Modified Two-Tiered Testing)",
        "Synovial Fluid PCR: มีความไวสูงมาก (> 80%) ในการวินิจฉัย Lyme Arthritis"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Early Localized (ผื่น Erythema migrans เดี่ยวๆ) / Early Disseminated ไม่รุนแรง (ผื่นหลายวง, อัมพาตใบหน้า Bell's palsy, ปวดข้อ): Oral Doxycycline 100 mg วันละ 2 ครั้ง นาน 10-14 วัน (*คำแนะนำล่าสุดของ CDC และ AAP: ยา Doxycycline สามารถใช้ในเด็กทุกช่วงอายุได้อย่างปลอดภัยหากให้ไม่เกิน 21 วัน โดยไม่ทำให้ฟันเปลี่ยนสี*) หรือ Oral Amoxicillin 500 mg วันละ 3 ครั้ง นาน 14 วัน หรือ Oral Cefuroxime axetil 500 mg วันละ 2 ครั้ง นาน 14 วัน",
      alternative: "Late Lyme / Severe Neurologic (Meningitis, Radiculoneuropathy) / Lyme Carditis รุนแรง (PR interval >= 300 ms, Complete AV block, Myopericarditis): IV Ceftriaxone 2 g วันละครั้ง นาน 14-21 วัน (ทางเลือก: IV Cefotaxime 2 g q8h หรือ IV Penicillin G 18-24 ล้านยูนิตต่อวัน); สตรีมีครรภ์: แนะนำ Oral Amoxicillin 500 mg tid หรือ Cefuroxime axetil 500 mg bid นาน 14 วัน (ห้ามใช้ Doxycycline ในหญิงตั้งครรภ์)",
      resistance: "การป้องกันหลังถูกเห็บกัด (Post-Exposure Prophylaxis: PEP): ให้ Oral Doxycycline 200 mg รับประทานครั้งเดียว (Single dose) ภายใน 72 ชั่วโมงหลังดึงเห็บออก เฉพาะในกรณีที่: 1. เห็บที่กัดระบุได้ว่าเป็น Ixodes scapularis, 2. เห็บเกาะดูดเลือดมาแล้ว >= 36 ชั่วโมง (ตัวเห็บเต่งบวม), และ 3. อัตราความชุกของเชื้อในเห็บท้องถิ่น >= 20%"
    }
  },

  "candida-albicans": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Yeast-to-Hyphae Morphological Transition",
          mechanism: "การเปลี่ยนรูปสัณฐานจาก Oval budding yeast เป็น Pseudohyphae และ True hyphae เป็นหัวใจสำคัญของการก่อโรค สายราแท้มีแรงดันกลไกเจาะทะลวงผ่านเซลล์เยื่อบุผิวและเนื้อเยื่อเกี่ยวพันเข้าสู่กระแสเลือด",
          desc: "การเปลี่ยนรูปสัณฐานจาก Oval budding yeast เป็น Pseudohyphae และ True hyphae เป็นหัวใจสำคัญของการก่อโรค สายราแท้มีแรงดันกลไกเจาะทะลวงผ่านเซลล์เยื่อบุผิวและเนื้อเยื่อเกี่ยวพันเข้าสู่กระแสเลือด"
        },
        {
          name: "Secreted Hydrolases (SAPs & Phospholipases)",
          mechanism: "Secreted Aspartyl Proteases (SAPs 1-10) ย่อยสลาย Keratin, Collagen, Mucin และ Secretory IgA; Phospholipase B ย่อยสลายฟอสโฟลิปิดในเยื่อหุ้มเซลล์โฮสต์ ทำให้เซลล์เยื่อบุผิวหลุดลอกเกิดเป็นแผ่นฝ้าขาวที่ขูดออกได้ (Oral thrush)",
          desc: "Secreted Aspartyl Proteases (SAPs 1-10) ย่อยสลาย Keratin, Collagen, Mucin และ Secretory IgA; Phospholipase B ย่อยสลายฟอสโฟลิปิดในเยื่อหุ้มเซลล์โฮสต์ ทำให้เซลล์เยื่อบุผิวหลุดลอกเกิดเป็นแผ่นฝ้าขาวที่ขูดออกได้ (Oral thrush)"
        },
        {
          name: "Candidalysin Toxin",
          mechanism: "Cytolytic peptide toxin ที่หลั่งเฉพาะจากระยะ Hyphae เจาะรูเยื่อหุ้มเซลล์เยื่อบุผิว (Pore-forming) กระตุ้นการหลั่งสารอักเสบและอาการแสบร้อนเนื้อเยื่อ",
          desc: "Cytolytic peptide toxin ที่หลั่งเฉพาะจากระยะ Hyphae เจาะรูเยื่อหุ้มเซลล์เยื่อบุผิว (Pore-forming) กระตุ้นการหลั่งสารอักเสบและอาการแสบร้อนเนื้อเยื่อ"
        },
        {
          name: "Biofilm Formation on Indwelling Devices",
          mechanism: "สร้างไบโอฟิล์มหนาแน่นประกอบด้วย Yeast, Hyphae และ Extracellular matrix เคลือบบนสายสวนหลอดเลือดดำ (Central venous catheters), สายสวนปัสสาวะ, และข้อเทียม ทนทานต่อยาต้านเชื้อรา",
          desc: "สร้างไบโอฟิล์มหนาแน่นประกอบด้วย Yeast, Hyphae และ Extracellular matrix เคลือบบนสายสวนหลอดเลือดดำ (Central venous catheters), สายสวนปัสสาวะ, และข้อเทียม ทนทานต่อยาต้านเชื้อรา"
        }
      ],
      immuneEvasion: [
        "การเปลี่ยนรูปไปมาเป็น Phenotypic switching ช่วยปรับตัวต่อสภาวะกรดด่างและหลบหลีกภูมิคุ้มกัน",
        "สายรากำบัง Beta-glucan ด้วย Mannan fibrils ชั้นนอก ทำให้ Dectin-1 receptors บน Macrophages ตรวจจับได้ยากขึ้น"
      ],
      transmission: "การติดเชื้อจากเชื้อประจำถิ่นในร่างกายตนเอง (Endogenous opportunistic overgrowth) เมื่อสมดุลจุลชีพปกติเสียไป (เช่น หลังยาปฏิชีวนะ broad-spectrum, การพ่นยาสเตียรอยด์ไม่บ้วนปาก, โรคเบาหวาน, หรือภาวะภูมิคุ้มกันบกพร่อง)"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "10-20% KOH Preparation หรือ Calcofluor white จากรอยโรคขูดฝ้า: พบ Oval budding yeast cells (3-6 um) ร่วมกับ Pseudohyphae (รอยคอดกิ่วระหว่างเซลล์) และ True hyphae; Gram Stain: ติดสี Gram-positive (สีม่วงเข้ม ขนาดใหญ่กว่าแบคทีเรียทั่วไป 3-5 เท่า)",
      stains: [
        "10% KOH Prep: Budding yeasts with pseudohyphae and septate branching hyphae",
        "Gram Stain: Gram-positive large oval yeasts (3-5 um) and pseudohyphae",
        "Periodic Acid-Schiff (PAS) & GMS: ย้อมชิ้นเนื้อเยื่อติดสีแดงม่วงหรือดำชัดเจน"
      ],
      culture: [
        "Sabouraud Dextrose Agar (SDA): โคโลนีสีขาวนวล ผิวเรียบมันคล้ายครีม (Creamy white colonies) มีกลิ่นยีสต์จำเพาะที่ 30-37°C ภายใน 24-48 ชม.",
        "Germ Tube Test: POSITIVE (+) งอกท่อ Germ tube (ท่อยื่นขนานไม่มีรอยคอด) ภายใน 2-3 ชม. เมื่อบ่มในซีรัมมนุษย์ที่ 37°C (แยก C. albicans และ C. dubliniensis จาก Candida สปีชีส์อื่น)",
        "CHROMagar Candida: ขึ้นโคโลนีสีเขียวมรกต (Emerald green colonies) ยืนยัน C. albicans ทันที"
      ],
      biochemical: [
        "Chlamydospore Formation: สร้างสปอร์ผนังหนาที่ปลายสายรา (Terminal thick-walled chlamydospores) บน Cornmeal agar ผสม Tween 80",
        "Urease Test: NEGATIVE (-) (ช่วยแยกจาก Cryptococcus neoformans ซึ่งเป็น Urease positive)",
        "(1,3)-Beta-D-Glucan Assay: ให้ผลบวกสูงใน Candidemia และ Invasive candidiasis"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Oral Thrush (คราบฝ้าขาวในปาก): อาการไม่รุนแรง: Clotrimazole troches 10 mg อมวันละ 5 ครั้ง หรือ Nystatin oral suspension (100,000 U/mL บ้วนกลั้วปากแล้วกลืน 4-6 mL วันละ 4 ครั้ง) นาน 7-14 วัน; อาการปานกลางถึงรุนแรง / Esophageal Candidiasis: Oral Fluconazole 200 mg วันแรก ตามด้วย 100-200 mg วันละครั้ง นาน 14-21 วัน; Candidemia & Invasive Candidiasis (IDSA Guidelines 2016 Update): First-line DOC คือยากลุ่ม Echinocandin (IV Caspofungin 70 mg loading แล้ว 50 mg/day, หรือ Micafungin 100 mg/day, หรือ Anidulafungin 200 mg loading แล้ว 100 mg/day) และต้องถอดสายสวนหลอดเลือดดำ (Catheter removal) ทันที พร้อมตรวจจอประสาทตา (Dilated fundus exam)",
      alternative: "Step-down Therapy ใน Candidemia: เปลี่ยนเป็น Oral Fluconazole (400-800 mg daily) เมื่อผู้ป่วยอาการคงที่ ผล hemoculture ซ้ำเป็นลบ และผลทดสอบความไวพบว่าไวต่อ Fluconazole; Vulvovaginal Candidiasis: Single-dose Oral Fluconazole 150 mg หรือ Topical azoles (Clotrimazole/Miconazole cream); สตรีมีครรภ์: แนะนำ Topical azoles นาน 7 วัน (หลีกเลี่ยง Oral Fluconazole ในไตรมาสแรก)",
      resistance: "กลไกการดื้อยา: C. albicans ส่วนใหญ่ยังไวต่อ Fluconazole แต่การใช้ยา azole ต่อเนื่องระยะยาวอาจเกิดการกลายพันธุ์ของยีน ERG11 (เอนไซม์ Lanosterol 14-alpha-demethylase) หรือการแสดงออกของ Efflux pumps (CDR1, CDR2, MDR1); ในขณะที่ Candida สปีชีส์อื่น เช่น C. krusei มีการดื้อต่อ Fluconazole ตามธรรมชาติ (Intrinsic resistance) และ C. glabrata มีอัตราดื้อยา Azoles สูงมาก จึงต้องใช้ Echinocandin เป็นหลัก"
    }
  },

  "clostridioides-difficile": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Toxin A (TcdA - Enterotoxin)",
          mechanism: "เข้าจับกับ Carbohydrate receptors บนผิวด้าน Apical ของ Enterocytes ถูกนำเข้าสู่เซลล์ ทำปฏิกิริยา Glucosylation ต่อโมเลกุล Rho Family GTPases (Rho, Rac, Cdc42) ทำลาย Actin cytoskeleton ทำให้ Tight junctions หลุดแยก ส่งผลให้ของเหลวและน้ำรั่วไหลเข้าสู่ช่องทางเดินอาหาร ก่อให้เกิดอาการท้องร่วงรุนแรง",
          desc: "เข้าจับกับ Carbohydrate receptors บนผิวด้าน Apical ของ Enterocytes ถูกนำเข้าสู่เซลล์ ทำปฏิกิริยา Glucosylation ต่อโมเลกุล Rho Family GTPases (Rho, Rac, Cdc42) ทำลาย Actin cytoskeleton ทำให้ Tight junctions หลุดแยก ส่งผลให้ของเหลวและน้ำรั่วไหลเข้าสู่ช่องทางเดินอาหาร ก่อให้เกิดอาการท้องร่วงรุนแรง"
        },
        {
          name: "Toxin B (TcdB - Cytotoxin)",
          mechanism: "มีความเป็นพิษต่อเซลล์สูงกว่า Toxin A ถึง 1,000 เท่า เข้าทำลายโครงสร้างเซลล์เยื่อบุผิวลำไส้โดยตรง กระตุ้น Caspases เหนี่ยวนำให้เกิด Apoptosis และกระตุ้นการหลั่งสารอักเสบ (IL-8, TNF-alpha) ดึงดูด Neutrophils หลั่งทะลักออกจากเยื่อบุคล้ายภูเขาไฟปะทุ (Volcano-like eruption) รวมตัวกับ Fibrin และ Mucus ก่อเป็นแผ่นเยื่อหลอกสีเหลืองขาว (Pseudomembranous colitis)",
          desc: "มีความเป็นพิษต่อเซลล์สูงกว่า Toxin A ถึง 1,000 เท่า เข้าทำลายโครงสร้างเซลล์เยื่อบุผิวลำไส้โดยตรง กระตุ้น Caspases เหนี่ยวนำให้เกิด Apoptosis และกระตุ้นการหลั่งสารอักเสบ (IL-8, TNF-alpha) ดึงดูด Neutrophils หลั่งทะลักออกจากเยื่อบุคล้ายภูเขาไฟปะทุ (Volcano-like eruption) รวมตัวกับ Fibrin และ Mucus ก่อเป็นแผ่นเยื่อหลอกสีเหลืองขาว (Pseudomembranous colitis)"
        },
        {
          name: "Binary Toxin (CDT)",
          mechanism: "พบในสายพันธุ์ดุร้ายรุนแรง (Hypervirulent strain BI/NAP1/027) ทำปฏิกิริยา ADP-ribosylation ต่อ Actin filaments เสริมสร้างการยึดเกาะของแบคทีเรียและเพิ่มความรุนแรงของโรค",
          desc: "พบในสายพันธุ์ดุร้ายรุนแรง (Hypervirulent strain BI/NAP1/027) ทำปฏิกิริยา ADP-ribosylation ต่อ Actin filaments เสริมสร้างการยึดเกาะของแบคทีเรียและเพิ่มความรุนแรงของโรค"
        }
      ],
      immuneEvasion: [
        "สปอร์ทนทานสูงต่อแอลกอฮอล์ (Alcohol-based hand rubs ฆ่าสปอร์ไม่ได้ ต้องล้างมือด้วยสบู่และน้ำเท่านั้น) และทนต่อสารฟอกขาวทั่วไป",
        "สายพันธุ์ NAP1/027 มีการกลายพันธุ์ลบยีน tcdC (Negative regulator) ทำให้ผลิต Toxin A และ B ออกมามากกว่าสายพันธุ์ทั่วไปถึง 16-23 เท่า"
      ],
      transmission: "Fecal-oral route โดยการกลืนสปอร์จากสิ่งแวดล้อมที่ปนเปื้อน หรือการสัมผัสผ่านมือบุคลากรทางการแพทย์ในโรงพยาบาล หลังจากการใช้ยาปฏิชีวนะกวาดล้างเชื้อประจำถิ่นในลำไส้ (เช่น Clindamycin, Fluoroquinolones, 3rd gen Cephalosporins)"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Gram Stain: Gram-positive spore-forming anaerobic bacilli with oval subterminal spores; การตรวจชิ้นเนื้อส่องกล้อง (Sigmoidoscopy / Colonoscopy): พบ Pseudomembranes แผ่นเยื่อหลอกสีเหลืองนวลกระจายบนเยื่อบุลำไส้ใหญ่ที่บวมแดง; Biopsy: ลักษณะเฉพาะคือ Volcano lesion (Exudate ของ Neutrophils, Fibrin และเศษเซลล์ตายพุ่งทะลักออกจาก Crypts)",
      stains: [
        "Endoscopy: Adherent yellow-white inflammatory pseudomembranes on colonic mucosa",
        "Biopsy: 'Volcano' or 'Mushroom-like' eruptive exudate from colonic crypts",
        "Gram Stain: Gram-positive rods with subterminal spores (Anaerobic)"
      ],
      culture: [
        "Stool NAAT / PCR (ตรวจหายีน tcdA, tcdB): ไวที่สุด (Sensitivity > 95%) แต่ไม่สามารถแยก colonized ออกจาก active disease ได้",
        "CCFA Agar (Cycloserine-Cefoxitin-Fructose Agar): เพาะเชื้อในสภาวะไร้ออกซิเจน เกิดโคโลนีสีเหลือง ผิวขรุขระ มีกลิ่นมูลม้า (Horse-manure odor) และเรืองแสงสีเหลืองเขียวใต้แสง UV",
        "Two-Step Algorithm (IDSA/SHEA): ตรวจคัดกรองด้วย GDH Antigen + Toxin A/B EIA หากผลไม่ตรงกันให้ยืนยันด้วย NAAT/PCR"
      ],
      biochemical: [
        "Glutamate Dehydrogenase (GDH) Antigen: สารคัดกรองที่มี Negative Predictive Value สูงมาก",
        "เกณฑ์ประเมินความรุนแรง (Severe CDI Criteria): WBC >= 15,000 cells/uL หรือ Serum Creatinine > 1.5 mg/dL",
        "Fulminant CDI: มีภาวะ Hypotension, Shock, Ileus, หรือ Toxic Megacolon (ลำไส้ใหญ่ขยายตัว > 6 ซม. เสี่ยงลำไส้แตก)"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Initial Episode (IDSA / SHEA 2021 Focused Update): 1. Oral Fidaxomicin 200 mg วันละ 2 ครั้ง นาน 10 วัน (เป็นยาที่แนะนำอันดับหนึ่งเนื่องจากยับยั้ง RNA polymerase เฉพาะ C. diff ไม่ทำลายเชื้อประจำถิ่นและลดการกลับเป็นซ้ำได้อย่างเด่นชัด) หรือ 2. Oral Vancomycin 125 mg วันละ 4 ครั้ง (QID) นาน 10 วัน (*หมายเหตุสำคัญ: ห้ามใช้ Metronidazole เป็นยาทางเลือกแรกอีกต่อไป!*)",
      alternative: "Fulminant CDI (ความดันตก, ช็อก, ลำไส้อัมพาต Ileus, Toxic megacolon): High-dose Oral Vancomycin 500 mg วันละ 4 ครั้ง (ให้ทางสาย NG tube ร่วมกับการสวนเหน็บทางทวารหนัก Vancomycin 500 mg ใน NSS 100 mL ทุก 6 ชม. กรณีมี ileus) PLUS IV Metronidazole 500 mg ทุก 8 ชม. พร้อมปรึกษาศัลยแพทย์เพื่อพิจารณาทำ Subtotal Colectomy หรือ Diverting Loop Ileostomy ทันที; First Recurrence: ให้ Fidaxomicin 200 mg bid 10 วัน หรือ Vancomycin แบบ Tapered/Pulsed regimen",
      resistance: "การป้องกันการกลับเป็นซ้ำ (Prevention of Recurrence): การให้ Bezlotoxumab (Human monoclonal antibody ต้าน Toxin B ฉีด IV 10 mg/kg ครั้งเดียว) ร่วมกับยาต้านจุลชีพ หรือการปลูกถ่ายจุลชีพในอุจจาระ (Fecal Microbiota Transplantation: FMT) ในผู้ที่กลับเป็นซ้ำตั้งแต่ครั้งที่ 2 ขึ้นไป; *ข้อห้ามเด็ดขาด*: ห้ามให้ยาหยุดถ่ายกลุ่ม Anti-motility agents (เช่น Loperamide, Diphenoxylate) อย่างเด็ดขาดเพราะจะทำให้สารพิษคั่งค้างและกระตุ้นให้เกิด Toxic Megacolon ถึงแก่ชีวิต!"
    }
  },

  "entamoeba-histolytica": {
    pathogenesis: {
      title: "กลไกก่อโรค (Pathogenesis)",
      virulenceFactors: [
        {
          name: "Gal/GalNAc Adherence Lectin",
          mechanism: "โปรตีนเฮเทอโรไดเมอร์บนผิวโทรโฟซอยต์ ยึดเกาะกับน้ำตาล Galactose และ N-acetylgalactosamine บนชั้นเมือก Mucin และเยื่อหุ้มเซลล์ของ Enterocytes หากปราศจากเลกตินนี้เชื้อจะไม่สามารถเกาะติดและบุกรุกเนื้อเยื่อได้",
          desc: "โปรตีนเฮเทอโรไดเมอร์บนผิวโทรโฟซอยต์ ยึดเกาะกับน้ำตาล Galactose และ N-acetylgalactosamine บนชั้นเมือก Mucin และเยื่อหุ้มเซลล์ของ Enterocytes หากปราศจากเลกตินนี้เชื้อจะไม่สามารถเกาะติดและบุกรุกเนื้อเยื่อได้"
        },
        {
          name: "Amoebapores (A, B, C Peptides)",
          mechanism: "เปปไทด์ขนาดเล็กเจาะรูเยื่อหุ้มเซลล์ (Pore-forming peptides) แทรกตัวเข้าสู่ฟอสโฟลิปิดของเซลล์โฮสต์ ก่อให้เกิดรูพรุนทำลายสมดุลออสโมติก ส่งผลให้เซลล์เม็ดเลือดแดง เซลล์เยื่อบุผิว และเซลล์ภูมิคุ้มกันเกิด Cytolysis แตกสลายอย่างรวดเร็ว",
          desc: "เปปไทด์ขนาดเล็กเจาะรูเยื่อหุ้มเซลล์ (Pore-forming peptides) แทรกตัวเข้าสู่ฟอสโฟลิปิดของเซลล์โฮสต์ ก่อให้เกิดรูพรุนทำลายสมดุลออสโมติก ส่งผลให้เซลล์เม็ดเลือดแดง เซลล์เยื่อบุผิว และเซลล์ภูมิคุ้มกันเกิด Cytolysis แตกสลายอย่างรวดเร็ว"
        },
        {
          name: "Cysteine Proteases (EhCP1 - EhCP5)",
          mechanism: "เอนไซม์ย่อยสลายคอลลาเจน, Extracellular matrix, Secretory IgA, และ Complement (C3a, C5a) ช่วยให้โทรโฟซอยต์เจาะทะลุผ่านชั้น Mucosa เข้าสู่ Submucosa และขยายตัวในแนวนอน ก่อให้เกิด 'แผลรูปขวดชมพู่ (Flask-shaped ulcers)' ในลำไส้ใหญ่",
          desc: "เอนไซม์ย่อยสลายคอลลาเจน, Extracellular matrix, Secretory IgA, และ Complement (C3a, C5a) ช่วยให้โทรโฟซอยต์เจาะทะลุผ่านชั้น Mucosa เข้าสู่ Submucosa และขยายตัวในแนวนอน ก่อให้เกิด 'แผลรูปขวดชมพู่ (Flask-shaped ulcers)' ในลำไส้ใหญ่"
        }
      ],
      immuneEvasion: [
        "ย่อยสลาย Complement C3a และ C5a ลดการเรียก Neutrophils มายังบริเวณที่ติดเชื้อ",
        "เคลื่อนที่เข้าสู่ระบบหลอดเลือดดำพอร์ทัล (Portal venous system) ไปยังตับ ก่อให้เกิดการตายแบบเหลวกลายเป็นฝีหนองก้อนเดี่ยวในตับกลีบขวา บรรจุของเหลวสีน้ำตาลแดงคล้ายกะปิหรือน้ำปลาซาร์ดีน ('Anchovy paste' liver abscess)"
      ],
      transmission: "Fecal-oral route โดยการดื่มน้ำหรือรับประทานอาหารที่ปนเปื้อน Mature quadrinucleate cysts ผนังหนา 4 นิวเคลียส ซึ่งทนต่อกรดในกระเพาะอาหารและทนต่อระดับคลอรีนในน้ำประปาทั่วไป"
    },
    diagnosis: {
      title: "การตรวจวินิจฉัยและห้องปฏิบัติการ (Diagnosis & Laboratory)",
      staining: "Stool Direct Wet Mount (NSS & Iodine) หรือ Permanent Trichrome Stain: พบ Trophozoite (15-20 um) เคลื่อนที่ด้วย Pseudopodia ขั้วเดียวอย่างรวดเร็ว และมีลักษณะจำเพาะชี้ขาดคือ 'Erythrophagocytosis' (กินเม็ดเลือดแดงเข้าไปอยู่ใน Cytoplasm ซึ่งเป็นตัวแยก E. histolytica แท้ ออกจาก E. dispar ที่ไม่กินเม็ดเลือดแดง); ย้อมไอโอดีนพบ Cysts ทรงกลม (10-15 um) มี 1-4 นิวเคลียส พร้อม Chromatoid bodies ขอบมนคล้ายซิการ์ (Cigar-shaped chromatoid bars)",
      stains: [
        "Trichrome Stain: Trophozoites with ingested red blood cells (Erythrophagocytosis - Pathognomonic)",
        "Stool Iodine: Cysts with 1 to 4 nuclei and rounded cigar-shaped chromatoid bars",
        "Biopsy: Trophozoites at the advancing margin of flask-shaped ulcers"
      ],
      culture: [
        "Stool Antigen Detection (EIA สำหรับ Gal/GalNAc lectin): มีความไวและความจำเพาะสูงมากในการแยกสายพันธุ์แท้",
        "Stool Multiplex Real-time PCR: Gold standard ในการตรวจหาสารพันธุกรรมจำเพาะ",
        "Amoebic Serology (IHA / ELISA): ให้ผลบวกสูงถึง 95% ในผู้ป่วยฝีในตับจากเชื้อบิด (Amoebic Liver Abscess: ALA) และให้ผลบวกใน 80% ของผู้ป่วยบิดมีตัวลงแผลลำไส้รุนแรง"
      ],
      biochemical: [
        "Ultrasound / CT Upper Abdomen: ตรวจพบ Single round/oval hypoechoic abscess cavity มักอยู่ที่ตับกลีบขวา (Right lobe) ติดขอบตับ",
        "Aspiration of Liver Abscess: ของเหลวข้นหนืดสีน้ำตาลช็อกโกแลตไร้กลิ่น ('Anchovy paste' or chocolate pus) ตรวจมักไม่พบเชื้อในใจกลางหนองเพราะเชื้ออาศัยอยู่ตามผนังโพรงฝี"
      ]
    },
    treatment: {
      title: "แนวทางการรักษาตามไกด์ไลน์ (Treatment & Guidelines)",
      firstLine: "Two-Step Stepwise Therapy (CDC / WHO Standard Protocol): ขั้นที่ 1 ยาฆ่าเชื้อในเนื้อเยื่อ (Tissue Amebicide): Oral Metronidazole 750 mg วันละ 3 ครั้ง (TID) นาน 7-10 วัน หรือ Oral Tinidazole 2 g วันละครั้ง นาน 3-5 วัน; ตามด้วย ขั้นที่ 2 ยาฆ่าเชื้อในท่อทางเดินอาหาร (Luminal Amebicide - *จำเป็นต้องให้เสมอเพื่อกำจัด Cysts ป้องกันการกลับเป็นซ้ำและการแพร่เชื้อ*): Oral Paromomycin 500 mg วันละ 3 ครั้ง นาน 7 วัน หรือ Oral Diloxanide furoate 500 mg วันละ 3 ครั้ง นาน 10 วัน",
      alternative: "Asymptomatic Cyst Passers (ผู้ตรวจพบ Cysts ในอุจจาระโดยไม่มีอาการ): ให้เฉพาะ Luminal Amebicide ตัวเดียว คือ Oral Paromomycin 500 mg tid นาน 7 วัน; กรณี Amoebic Liver Abscess อาการรุนแรง: IV Metronidazole 500-750 mg ทุก 8 ชม. ร่วมกับเจาะดูดหนองเฉพาะเมื่อ: 1. ก้อนฝีขนาดใหญ่ > 5 ซม. เสี่ยงต่อการแตก, 2. ก้อนฝีอยู่ที่ตับกลีบซ้าย (เสี่ยงแตกเข้าเยื่อหุ้มหัวใจ Pericardium), หรือ 3. ไข้ไม่ลดลงหลังได้ยา 72 ชม.",
      resistance: "ข้อควรระวัง: Metronidazole มีปฏิกิริยา Disulfiram-like reaction (ห้ามดื่มแอลกอฮอล์เด็ดขาดระหว่างกินยาและหลังหยุดยา 48 ชม. เพราะจะทำให้คลื่นไส้อาเจียนรุนแรง ปวดศีรษะ แน่นหน้าอก); ในหญิงตั้งครรภ์ Paromomycin ปลอดภัยเพราะแทบไม่ถูกดูดซึมเข้าสู่กระแสเลือด"
    }
  }
};

const transmissions = {
  "streptococcus-pyogenes": "การสัมผัสโดยตรง (Direct contact) ผ่านแผลถลอก แผลผ่าตัด หรือแมลงกัด, ละอองฝอยทางเดินหายใจ (Respiratory droplets), และการสัมผัสสารคัดหลั่งจากลำคอ",
  "neisseria-gonorrhoeae": "การมีเพศสัมพันธ์โดยตรง (Sexual intercourse: vaginal, anal, oral) โดยไม่สวมถุงยางอนามัย และการส่งผ่านจากมารดาสู่ทารกขณะคลอดทางช่องคลอด (Ophthalmia neonatorum)",
  "burkholderia-pseudomallei": "การสัมผัสโดยตรงกับดินเปียกหรือน้ำขัง (Percutaneous inoculation) ผ่านรอยแผล โดยเฉพาะเกษตรกรในฤดูฝน (ภาคอีสาน), การสูดดมละอองฝุ่นดินหลังพายุฝน, และการดื่มน้ำไม่ต้มสุก",
  "streptococcus-pneumoniae": "ละอองฝอยทางเดินหายใจ (Respiratory droplets) จากผู้ป่วยหรือพาหะที่มีเชื้อในโพรงจมูก (Nasopharyngeal carriage) บุกรุกเมื่อภูมิคุ้มกันลดลงหรือหลังเป็นไข้หวัดใหญ่",
  "escherichia-coli": "การลุกลามย้อนศรจากทวารหนักสู่ทางเดินปัสสาวะ (Ascending infection จาก Perineal flora เข้าสู่กระเพาะปัสสาวะและกรวยไต) พบบ่อยในเพศหญิงและผู้คาสายสวนปัสสาวะ",
  "shigella-dysenteriae": "Fecal-oral route (อุจจาระสู่ปาก) ผ่าน '4 Fs': Fingers, Flies, Food, Fomites ด้วยปริมาณเชื้อก่อโรคต่ำมากเพียง 10-100 ตัวก็ทำให้เกิดบิดมูกเลือดรุนแรง",
  "chlamydia-trachomatis": "การมีเพศสัมพันธ์โดยตรง (Vaginal, anal, or oral sex) กับคู่นอนที่ติดเชื้อ (ส่วนใหญ่มักไม่แสดงอาการ) และการส่งผ่านจากมารดาสู่ทารกขณะคลอด",
  "leptospira-interrogans": "การสัมผัสโดยตรงกับน้ำ ดินโคลน หรือน้ำท่วมขังที่ปนเปื้อนปัสสาวะของหนูหรือสัตว์รังโรค ผ่านบาดแผล รอยถลอก หรือเยื่อบุตา/จมูก/ปาก ขณะเดินลุยน้ำท่วมหรือทำนา",
  "orientia-tsutsugamushi": "การถูกกัดโดยตัวอ่อนของไรอ่อน (Chigger mite larva สกุล Leptotrombidium) ขณะเดินลุยป่าละเมาะ ทุ่งหญ้า ชายป่า ในแถบเอเชียแปซิฟิก (Tsutsugamushi triangle)",
  "salmonella-typhi": "Fecal-oral route โดยการบริโภคน้ำดื่มหรืออาหารที่ปนเปื้อนอุจจาระหรือปัสสาวะของผู้ป่วยหรือพาหะเรื้อรัง (Chronic gallbladder carrier เช่น แม่ค้าขายอาหาร)",
  "cryptococcus-neoformans": "การสูดดมละอองฝอยของสปอร์หรือเซลล์ยีสต์แห้งจากสิ่งแวดล้อมที่ปนเปื้อนมูลนกพิราบ (Pigeon droppings) เข้าสู่ปอด ในผู้ป่วยภูมิคุ้มกันบกพร่อง (CD4 < 100)",
  "histoplasma-capsulatum": "การสูดดมสปอร์ Microconidia จากดินที่อุดมด้วยมูลนกหรือมูลค้างคาว (Bat/bird guano) เช่น การเข้าไปสำรวจถ้ำ (Spelunking) หรือเล้าไก่เก่าในแถบภาคใต้",
  "talaromyces-marneffei": "การสูดดมสปอร์ Conidia จากดินหรือสิ่งแวดล้อมที่สัมพันธ์กับหนูพุกไม้ไผ่ (Bamboo rats สกุล Rhizomys) ในภาคเหนือของไทย (เชียงใหม่ ลำพูน) ในผู้ป่วย HIV (CD4 < 100)",
  "aspergillus-fumigatus": "การสูดดม Conidia (สปอร์) ที่ลอยในอากาศจากฝุ่นซากพืชเน่าเปื่อย ดิน ปุ๋ยหมัก หรือฝุ่นก่อสร้าง ในผู้ป่วยที่มีเม็ดเลือดขาวต่ำ หรือมีโพรงปอดเดิมจากวัณโรค",
  "rhizopus-arrhizus": "การสูดดมสปอร์ Sporangiospores จากดิน ขนมปังขึ้นรา หรือฝุ่นพืชเน่าเปื่อยเข้าสู่โพรงจมูกและไซนัส ในผู้ป่วยเบาหวานที่มีกรดคีโตนคั่ง (DKA) หรือผู้ใช้ยา Deferoxamine",
  "pseudomonas-aeruginosa": "การติดเชื้อในโรงพยาบาล (Nosocomial) จากสิ่งแวดล้อมชื้น (เครื่องช่วยหายใจ, สายสวน), แผลไฟไหม้รุนแรง, บาดแผลตะปูแทงทะลุรองเท้าผ้าใบ, การแช่อ่างน้ำร้อน (Hot tub folliculitis)",
  "vibrio-vulnificus": "การรับประทานอาหารทะเลสุกๆ ดิบๆ (โดยเฉพาะหอยนางรมดิบ Raw oysters) หรือบาดแผลเปิดสัมผัสน้ำทะเล/น้ำกร่อย หรือถูกเงี่ยงปลา/เปลือกหอยทิ่มแทง ในคนตับแข็งหรือเหล็กคั่ง",
  "neisseria-meningitidis": "การสูดดมละอองฝอยทางเดินหายใจ (Respiratory droplets) หรือสัมผัสสารคัดหลั่งช่องคอ จากการอยู่ร่วมกันอย่างใกล้ชิดและแออัด (หอพักนักศึกษา, ค่ายทหารเกณฑ์)"
};

let updatedCount = 0;

microbes.forEach(m => {
  if (medicalData[m.id]) {
    const data = medicalData[m.id];
    m.tabs = m.tabs || {};
    m.tabs.pathogenesis = { ...m.tabs.pathogenesis, ...data.pathogenesis };
    m.tabs.diagnosis = { ...m.tabs.diagnosis, ...data.diagnosis };
    m.tabs.treatment = { ...m.tabs.treatment, ...data.treatment };
    updatedCount++;
    console.log(`[UPDATED 1-9] Standardized ${m.id}`);
  } else if (m.tabs) {
    // Standardize microbes 10-27 so that virulenceFactors has both mechanism and desc,
    // culture is guaranteed to be an array of strings, and transmission is set!
    if (m.tabs.pathogenesis) {
      if (!m.tabs.pathogenesis.transmission && transmissions[m.id]) {
        m.tabs.pathogenesis.transmission = transmissions[m.id];
      }
      if (m.tabs.pathogenesis.virulenceFactors) {
        m.tabs.pathogenesis.virulenceFactors.forEach(vf => {
          if (!vf.mechanism && vf.desc) vf.mechanism = vf.desc;
          if (!vf.desc && vf.mechanism) vf.desc = vf.mechanism;
        });
      }
    }
    if (m.tabs.diagnosis) {
      if (typeof m.tabs.diagnosis.culture === 'string') {
        m.tabs.diagnosis.culture = [ m.tabs.diagnosis.culture ];
      }
      if (typeof m.tabs.diagnosis.staining === 'string' && (!m.tabs.diagnosis.stains || m.tabs.diagnosis.stains.length === 0)) {
        m.tabs.diagnosis.stains = [ m.tabs.diagnosis.staining ];
      }
    }
    console.log(`[STANDARDIZED 10-27] Checked ${m.id}`);
  }
});

fs.writeFileSync(DB_PATH, JSON.stringify(microbes, null, 2), 'utf8');
console.log(`\n======================================================`);
console.log(`[SUCCESS] Database standardized for all ${microbes.length} microbes!`);
console.log(`======================================================`);
