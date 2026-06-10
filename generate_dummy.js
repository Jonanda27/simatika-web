const XLSX = require("xlsx");

const data = [
  // Keluarga 1 (3 Anggota)
  {
    NO_KK_PAROKI: "3301010101010101",
    STATUS_TINGGAL: "Keluarga Utama",
    NAMA_LENGKAP: "Antonius Budi Santoso",
    NIK: "3301010101010001",
    JENIS_KELAMIN: "L",
    TEMPAT_LAHIR: "Semarang",
    TANGGAL_LAHIR: "1975-08-12",
    STATUS_KELUARGA: "Kepala Keluarga"
  },
  {
    NO_KK_PAROKI: "3301010101010101",
    STATUS_TINGGAL: "Keluarga Utama",
    NAMA_LENGKAP: "Maria Sulastri",
    NIK: "3301010101010002",
    JENIS_KELAMIN: "P",
    TEMPAT_LAHIR: "Salatiga",
    TANGGAL_LAHIR: "1980-04-21",
    STATUS_KELUARGA: "Istri"
  },
  {
    NO_KK_PAROKI: "3301010101010101",
    STATUS_TINGGAL: "Keluarga Utama",
    NAMA_LENGKAP: "Yohanes Kevin Santoso",
    NIK: "3301010101010003",
    JENIS_KELAMIN: "L",
    TEMPAT_LAHIR: "Timika",
    TANGGAL_LAHIR: "2005-11-05",
    STATUS_KELUARGA: "Anak"
  },
  
  // Keluarga 2 (2 Anggota)
  {
    NO_KK_PAROKI: "3301020202020202",
    STATUS_TINGGAL: "Keluarga Utama",
    NAMA_LENGKAP: "Petrus Jatmiko",
    NIK: "3301020202020001",
    JENIS_KELAMIN: "L",
    TEMPAT_LAHIR: "Yogyakarta",
    TANGGAL_LAHIR: "1968-02-28",
    STATUS_KELUARGA: "Kepala Keluarga"
  },
  {
    NO_KK_PAROKI: "3301020202020202",
    STATUS_TINGGAL: "Keluarga Utama",
    NAMA_LENGKAP: "Lucia Wulandari",
    NIK: "3301020202020002",
    JENIS_KELAMIN: "P",
    TEMPAT_LAHIR: "Sleman",
    TANGGAL_LAHIR: "1972-10-10",
    STATUS_KELUARGA: "Istri"
  },

  // Keluarga 3 (1 Anggota)
  {
    NO_KK_PAROKI: "3301030303030303",
    STATUS_TINGGAL: "Numpang (Keluarga)",
    NAMA_LENGKAP: "Ignasius Dimas",
    NIK: "3301030303030001",
    JENIS_KELAMIN: "L",
    TEMPAT_LAHIR: "Timika",
    TANGGAL_LAHIR: "1995-07-14",
    STATUS_KELUARGA: "Kepala Keluarga"
  }
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Data_Umat");

XLSX.writeFile(wb, "Data_Uji_Coba_Import.xlsx");
console.log("File Excel berhasil dibuat: Data_Uji_Coba_Import.xlsx");
