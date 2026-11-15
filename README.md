# 🧬 Pathox-Micro (2D Kurzgesagt Clinical Lesions Visualizer)

> **เว็บแอปพลิเคชันภาพ 2D สไตล์ Kurzgesagt แท้ (Authentic 2D Vector Art)**  
> สำหรับนักศึกษาแพทย์เตรียมสอบ **NL1 (National License Part 1)** & **USMLE Step 1**  
> โดยผู้ใช้สามารถ **"เลือกดูและค้นหาตามรายชื่อเชื้อก่อโรค (Pathogens)"** แต่ **"ภาพที่แสดงจะเป็นรอยโรคทางคลินิก (Clinical Lesions เช่น แผล ตุ่ม สะเก็ด ผื่น)"** ที่เกิดจากเชื้อนั้นๆ!

---

## 🎨 สถาปัตยกรรมและทิศทางงานภาพ (Core Concept)

1. **เลือกค้นหาตาม "เชื้อก่อโรค" (Pathogen Selection & Search):**
   - ผู้ใช้เลือกหรือค้นหาตามชื่อเชื้อ เช่น *Variola Virus*, *Staphylococcus aureus*, *Bacillus anthracis*, *Treponema pallidum*, *Varicella-Zoster*, *Borrelia burgdorferi*, *Candida albicans*
   - กรองตามหมวดหมู่: `ไวรัส (Viruses)`, `แบคทีเรีย (Bacteria)`, `เชื้อรา (Fungi)`
2. **ภาพที่แสดงเป็น "รอยโรคทางคลินิก" (Clinical Lesion 2D Vector):**
   - ภาพประกอบเวกเตอร์ 2 มิติสไตล์ **Kurzgesagt แท้** พร้อมเส้นขอบ Bold Navy Outline (`#0f172a`), การลงแสงเงาแบบ Stepped Cel Gradients, และชั้นผิวหนังตัดขวาง (Skin Tissue Block)
3. **ระบบผ่าดูชั้นผิวหนัง (Cross-Section Cutaway Toggle):**
   - **Surface View (มุมมองผิวนอกรอยโรค):** ตรวจดูขอบแผล, สีสะเก็ด, รอยบุ๋มสะดือ, วงแดงรอบแผล
   - **Cross-Section View (ผ่าดูชั้นผิวหนัง 2D):** ผ่าดูความลึกของรอยโรค (Epidermis, Dermis, Subcutaneous Fat) เช่น โพรงหนองลึก, กำแพงไฟบริน, การอุดตันของหลอดเลือด, หรือเซลล์ยักษ์หลายนิวเคลียส
4. **Interactive Vector Hotspots:**
   - คลิกชิ้นส่วนของรอยโรคเพื่อไฮไลต์และซูมดูข้อมูลในแถบด้านข้าง (High-Yield Medical Drawer)

---

## 🔬 ตารางความเชื่อมโยง: เชื้อก่อโรค ➔ รอยโรค 2D Kurzgesagt

| เชื้อก่อโรค (ที่เลือก/ค้นหา) | ประเภท | รอยโรคทางคลินิกที่ภาพ 2D แสดงผล | รายละเอียดชั้นผิวหนัง (Cross-Section) |
|---|---|---|---|
| **Variola Virus (Smallpox)** | ไวรัส | **ตุ่มหนองแข็งลึกบุ๋มสะดือตรงกลาง (Umbilicated Pustule)** | โพรงหนองหลายห้อง (Multilocular) ฝังลึกถึงชั้นหนังแท้ (Dermis) พร้อม Guarnieri inclusion bodies |
| **Staphylococcus aureus** | แบคทีเรีย | **แผลสะเก็ดสีน้ำผึ้ง (Honey-Colored Crusts) & ฝีหนอง (Abscess)** | รอยแยกใต้ชั้นขี้ไคล (**Subcorneal cleft**) และโพรงหนองลึกที่ล้อมด้วย **กำแพงไฟบริน (Fibrin wall)** จาก Coagulase |
| **Bacillus anthracis** | แบคทีเรีย | **แผลสะเก็ดเนื้อตายสีดำสนิท ไม่เจ็บ (Coal-Black Eschar)** | แผลสะเก็ดดำจมลึก ล้อมด้วยวงตุ่มน้ำใสบริวาร (**Satellite vesicles**) และชั้นหนังแท้บวมน้ำเยลลี่ (**Gelatinous Edema**) |
| **Treponema pallidum (Syphilis)** | แบคทีเรีย | **แผลริมแข็ง ก้นสะอาด ไม่เจ็บ (Hard Chancre)** | แผลหลุมเดี่ยวขอบยกนูนแข็งคล้ายกระดูกอ่อน (**Indurated rim**) ก้นแผลสะอาดสีแดง และหลอดเลือดตีบตัน (**Endarteritis obliterans**) |
| **Varicella-Zoster Virus (VZV)** | ไวรัส | **ตุ่มน้ำใสบนฐานแดง (Dew Drops on a Rose Petal)** | ตุ่มน้ำใสรูปหยดน้ำค้างบนฐานแดงสดรูปกลีบกุหลาบ ภายในพบ **Multinucleated Giant Cells** (Tzanck Positive) |
| **Borrelia burgdorferi (Lyme)** | แบคทีเรีย | **ผื่นเป้าตาวัวขอบแดงขยายกว้าง (Erythema Migrans)** | จุดกัดของเห็บ (Bite papule) ล้อมด้วยวงใส (Clearing ring) และขอบแดงวงแหวนที่ขยายขนาดออก > 5 ซม. พร้อมตัวเห็บ Ixodes |
| **Candida albicans** | เชื้อรา | **ฝ้าขาวขูดออกได้บนเยื่อบุสีแดงสด (Oral Thrush)** | คราบฝ้าขาวคล้ายคอตเทจชีสเกาะบนเยื่อบุช่องปาก เมื่อขูดออกจะพบพื้นผิวสีแดงสดมีเลือดซึม |

---

## 📚 แถบข้อมูลสรุป High-Yield 5 มิติ (Medical Drawer)
- **Tab 1: สัณฐานแผล (Morphology):** ขนาด, ความลึกในชั้นผิวหนัง, การคลำตรวจ (Shotty, Induration, Fluctuance)
- **Tab 2: กลไกก่อโรค (Pathogenesis):** สารพิษที่ทำให้เกิดแผล (TSST-1, Exfoliatin, Lethal/Edema Factor, SPICE)
- **Tab 3: ตรวจรอยโรค & Lab:** ขูดก้นแผลตรวจ Tzanck smear, Gram stain, KOH prep, Darkfield microscopy, Cam CAM egg culture
- **Tab 4: Clinical NL1 Pearls:** โจทย์เคสคลินิกเสมือนจริง, คำบอกใบ้ออกสอบ Buzzwords, จุดลวงในข้อสอบ
- **Tab 5: ดูแลแผล & ยา:** ยาอันดับหนึ่ง (Drug of Choice), การทำแผล (I&D, ห้ามขูดสะเก็ดแอนแทรกซ์), วัคซีน

---

## 🌐 วิธีการเปิดใช้งาน (How to View)

เซิร์ฟเวอร์เปิดใช้งานอยู่แล้ว สามารถเปิด Browser ไปที่:
👉 **`http://localhost:3000`**
