// ==================== KONFIGURASI ====================
const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1BC1kS6M4wu3OtPeK3HCjMYvTa8Ro_TrJz_Nfqb-I2as/edit";
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEpmBkcYm0IwkYrShx931lJjsSdnlocPeQ-N8zgX84kKfxny1CboCTZiPBoXTw9yj2cw/exec";

// Daftar kelompok dengan kavling dan harga
const kelompokKavling = {
  'KLP 37 - Huda & Welly': {
    kavling: ["851", "852", "853", "854", "855", "856", "857", "858", "859", "860", "861", "862", "863", "864", "865", "866", "867", "868", "869", "870", "871", "872", "873", "874", "908"],
    harga: 2500
  },
  'KLP 38 - Slamet & Ari M': {
    kavling: ["875", "876", "877", "878", "879", "880", "881", "975", "976", "980", "981", "982", "983", "984", "985", "986", "987", "988", "989", "990", "996", "997", "998", "999", "1000"],
    harga: 2500
  },
  'KLP 39 - Iis & Ahmadi': {
    kavling: ["882", "950", "951", "952", "953", "954", "955", "956", "957", "958", "959", "960", "961", "962", "963", "964", "965", "966", "967", "968", "969", "977", "978", "979", "1040"],
    harga: 2500
  },
  'KLP 40 - Wahyudi & Aswan': {
    kavling: ["1006", "1007", "1008", "1009", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1031", "1032", "1033", "1034", "1035", "1036", "1037", "1038", "1039", "1040"],
    harga: 2500
  },
  'KLP 41 - Suwat & Harnidi': {
    kavling: ["995", "994", "993", "992", "991", "970", "971", "972", "973", "974", "1001", "1002", "1003", "1004", "1005", "1021", "1022", "1023", "1024", "1025", "1026", "1027", "1028", "1029", "1030"],
    harga: 2500
  },
  'KLP 42 - Suparno & Siswo': {
    kavling: ["1042", "1043", "1044", "1045", "1046", "1047", "1048", "1049", "1050", "1051", "1052", "1053", "1054", "1055", "1056", "1057", "1058", "1059", "1060", "1061", "1062", "1063", "1064", "1065", "1066"],
    harga: 2500
  },
  'KLP 43 - Suganda & Budi': {
    kavling: ["1067", "1068", "1069", "1070", "1073", "1074", "1075", "1076", "1077", "1078", "1079", "1080", "1081", "1082", "1083", "1084", "1097", "1098", "1099", "1100", "1101", "1102", "1103", "1104", "1105"],
    harga: 2500
  },
  'KLP 44 - Siswanto & Ahmad': {
    kavling: ["1071", "1072", "1085", "1086", "1087", "1088", "1089", "1090", "1091", "1092", "1093", "1094", "1095", "1096", "1106", "1107", "1108", "1109", "1110", "1111", "1112", "1113", "1131", "1132", "1133"],
    harga: 2500
  },
  'KLP 45 - Dedi & Ely': {
    kavling: ["1114", "1115", "1116", "1117", "1128", "1127", "1129", "1130", "1134", "1135", "1137", "1139", "1140", "1141", "1149", "1150", "1151", "1152", "1154", "1156", "1157", "1155", "1166"],
    harga: 2500
  },
  'KLP 46 - Supardi & Maryanto': {
    kavling: ["1118", "1119", "1120", "1123", "1124", "1125", "1126", "1142", "1143", "1144", "1145", "1146", "1147", "1148", "1158", "1159", "1160", "1161", "1162", "1163", "1164", "1165", "1166"],
    harga: 2500
  },
  'KLP 47 - Yusuf & Ngatijo': {
    kavling: ["1167", "1168", "1169", "1170", "1174", "1175", "1176", "1177", "1179", "1180", "1181", "1182", "1183", "1184", "1185", "1186", "1187", "1188", "1189", "1190", "1191", "1192", "1193", "1194"],
    harga: 2500
  },
  'KLP 48 - Rukito & Goklas': {
    kavling: ["1171", "1172", "1173", "1195", "1196", "1198", "1199", "1200", "1201", "1202", "1203", "1204", "1205", "1206", "1207", "1208", "1210", "1211", "1212", "1213", "1214", "1215", "1216"],
    harga: 2500
  }
};

const pengurusList = Object.keys(kelompokKavling);

// ==================== STATE GLOBAL ====================
const state = {
  dataPanen: [],
  detailData: {},
  currentPage: 1,
  itemsPerPage: 10,
  isSubmitting: false,
  hasDraft: false,
  isDarkMode: localStorage.getItem('darkMode') === 'true'
};

// ==================== FUNGSI UTILITAS ====================

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

function validateNumber(input) {
  if (input.value < 0) {
    input.value = 0;
  }
}

function getHargaKavling(kelompok, kavling) {
  if (!kelompok || !kelompokKavling[kelompok]) return 2500;
  return kelompokKavling[kelompok].harga || 2500;
}

function calculateTotal(data) {
  const beratTotal = (data.jumlahTandan || 0) * 25;
  const berondolan = data.berondolan || 0;
  const totalBerat = beratTotal + berondolan;
  const harga = getHargaKavling(data.pengurus, data.kavling);
  const totalValue = totalBerat * harga;
  
  return {
    beratTotal,
    totalBerat,
    harga,
    totalValue: formatCurrency(totalValue),
    rupiah: totalValue
  };
}

function showSkeletonLoader() {
  const mobileCards = document.getElementById('mobileCards');
  const tabel = document.querySelector('#tabelPanen tbody');
  
  mobileCards.innerHTML = `
    <div class="space-y-4">
      ${Array(3).fill().map(() => `
        <div class="skeleton-item h-28 rounded-xl"></div>
      `).join('')}
    </div>
  `;
  
  if (tabel) {
    tabel.innerHTML = `
      ${Array(3).fill().map(() => `
        <tr>
          ${Array(8).fill().map(() => `
            <td class="py-4 px-6"><div class="skeleton-item h-6 rounded"></div></td>
          `).join('')}
        </tr>
      `).join('')}
    `;
  }
}

// ==================== FUNGSI API ====================

function updateStatus(status, message) {
  const statusText = document.getElementById('statusText');
  const syncStatus = document.getElementById('syncStatus');
  
  statusText.textContent = message;
  
  switch(status) {
    case 'connected':
      statusText.className = 'text-green-600 dark:text-green-400 font-medium';
      syncStatus.innerHTML = '<i class="bi bi-cloud-check"></i> Terhubung';
      syncStatus.className = 'px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold dark:bg-green-900 dark:text-green-300';
      break;
    case 'loading':
      statusText.className = 'text-yellow-600 dark:text-yellow-400 font-medium';
      syncStatus.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Memuat';
      syncStatus.className = 'px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold dark:bg-yellow-900 dark:text-yellow-300';
      break;
    default:
      statusText.className = 'text-red-600 dark:text-red-400 font-medium';
      syncStatus.innerHTML = '<i class="bi bi-cloud-slash"></i> Offline';
      syncStatus.className = 'px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-bold dark:bg-red-900 dark:text-red-300';
  }
}

async function callAppScript(action, data = null) {
  const url = new URL(APP_SCRIPT_URL);
  url.searchParams.append('action', action);
  
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        url.searchParams.append(key, data[key]);
      }
    });
  }
  
  url.searchParams.append('_', Date.now());
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url.toString(), {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Server terlalu lama merespon.');
    } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    throw new Error(`Gagal terhubung ke server: ${error.message}`);
  }
}

async function loadData() {
  updateStatus('loading', 'Memuat data...');
  showSkeletonLoader();
  
  try {
    const result = await callAppScript('getData');
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    state.dataPanen = result.data
      .map(item => ({
        id: item.ID,
        tanggal: item.Tanggal,
        pengurus: item.Pengurus,
        pemanen: item.Pemanen,
        kavling: item.Kavling,
        jumlahTandan: parseInt(item.Total_Tandan) || 0,
        berondolan: parseInt(item.Berondolan) || 0,
        tanggalObj: new Date(item.Tanggal)
      }))
      .sort((a, b) => b.tanggalObj - a.tanggalObj);
    
    state.detailData = {};
    result.data.forEach(item => {
      state.detailData[item.ID] = {
        id: item.ID,
        tanggal: item.Tanggal,
        pengurus: item.Pengurus,
        pemanen: item.Pemanen,
        kavling: item.Kavling,
        matang: parseInt(item.Tandan_Matang) || 0,
        mentah: parseInt(item.Tandan_Mentah) || 0,
        busuk: parseInt(item.Tandan_Busuk) || 0,
        jangkos: parseInt(item.Jangkos) || 0,
        jumlahTandan: parseInt(item.Total_Tandan) || 0,
        berondolan: parseInt(item.Berondolan) || 0,
        tanggalObj: new Date(item.Tanggal)
      };
    });
    
    updateAllViews();
    updateStatus('connected', `Data dimuat: ${result.count} entri`);
    document.getElementById('lastUpdate').textContent = formatTime(new Date());
    
    return true;
    
  } catch (error) {
    updateStatus('disconnected', error.message);
    
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Data',
      text: error.message,
      footer: 'Coba refresh halaman atau periksa koneksi internet',
      confirmButtonColor: '#dc2626'
    });
    
    return false;
  }
}

async function saveData() {
  if (state.isSubmitting) {
    await Swal.fire({
      icon: 'warning',
      title: 'Sedang Menyimpan',
      text: 'Tunggu proses penyimpanan sebelumnya selesai',
      timer: 2000,
      confirmButtonColor: '#f59e0b'
    });
    return;
  }
  
  const forms = document.querySelectorAll('#accordionPanen .accordion-item');
  if (forms.length === 0) {
    await Swal.fire({
      icon: 'info',
      title: 'Tidak Ada Data',
      text: 'Tidak ada data untuk disimpan',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }
  
  let isValid = true;
  let errorMessages = [];
  
  forms.forEach((form, index) => {
    const requiredFields = form.querySelectorAll('select[required], input[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        const fieldName = field.previousElementSibling?.textContent || field.getAttribute('placeholder') || 'Field';
        errorMessages.push(`Form ${index + 1}: ${fieldName} harus diisi!`);
        field.classList.add('border-red-500');
      } else {
        field.classList.remove('border-red-500');
      }
    });
  });
  
  if (!isValid) {
    await Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      html: errorMessages.join('<br>'),
      confirmButtonColor: '#dc2626'
    });
    return;
  }
  
  const { value: confirmSave } = await Swal.fire({
    title: 'Simpan Data?',
    text: `Anda akan menyimpan ${forms.length} data panen`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Simpan!',
    cancelButtonText: 'Batal'
  });
  
  if (!confirmSave) return;
  
  state.isSubmitting = true;
  updateStatus('loading', 'Menyimpan data...');
  
  const savePromises = [];
  
  forms.forEach(form => {
    const pengurus = form.querySelector('.pengurus').value;
    const tanggal = form.querySelector('.tanggal').value;
    const pemanen = form.querySelector('.pemanen').value;
    const kavling = form.querySelector('.kavling').value;
    
    const matang = Math.max(0, parseInt(form.querySelector('.matang').value) || 0);
    const mentah = Math.max(0, parseInt(form.querySelector('.mentah').value) || 0);
    const busuk = Math.max(0, parseInt(form.querySelector('.busuk').value) || 0);
    const jangkos = Math.max(0, parseInt(form.querySelector('.jangkos').value) || 0);
    const berondolan = Math.max(0, parseInt(form.querySelector('.berondolan').value) || 0);
    const jumlahTandan = matang + mentah + busuk + jangkos;

    const data = {
      tanggal,
      pengurus,
      pemanen,
      kavling,
      matang,
      mentah,
      busuk,
      jangkos,
      jumlahTandan,
      berondolan
    };
    
    savePromises.push(callAppScript('addData', {data: JSON.stringify(data)}));
  });
  
  try {
    const results = await Promise.allSettled(savePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && !r.value?.error);
    const failed = results.filter(r => r.status === 'rejected' || (r.value && r.value.error));
    
    document.getElementById('accordionPanen').innerHTML = '';
    createForm();
    
    clearDraft();
    
    await loadData();
    
    if (failed.length > 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Penyimpanan Sebagian',
        html: `${successful.length} data berhasil disimpan<br>${failed.length} data gagal disimpan`,
        confirmButtonColor: '#f59e0b'
      });
    } else {
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${results.length} data berhasil disimpan ke Google Sheets!`,
        timer: 3000,
        confirmButtonColor: '#16a34a'
      });
    }
    
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: error.message,
      footer: 'Data telah disimpan sebagai draft di browser',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    state.isSubmitting = false;
  }
}

async function deleteData(id) {
  const { isConfirmed } = await Swal.fire({
    title: 'Hapus Data?',
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3b82f6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  });
  
  if (!isConfirmed) return;
  
  updateStatus('loading', 'Menghapus data...');
  
  try {
    const result = await callAppScript('deleteData', {id: id});
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    state.dataPanen = state.dataPanen.filter(item => item.id !== id);
    delete state.detailData[id];
    
    updateAllViews();
    
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data berhasil dihapus',
      timer: 2000,
      confirmButtonColor: '#16a34a'
    });
    
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus',
      text: error.message,
      confirmButtonColor: '#dc2626'
    });
  }
}

async function clearAllData() {
  const { isConfirmed } = await Swal.fire({
    title: 'Hapus SEMUA Data?',
    text: "Semua data akan dihapus permanen! Tindakan ini tidak dapat dibatalkan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3b82f6',
    confirmButtonText: 'Ya, Hapus Semua!',
    cancelButtonText: 'Batal',
    showDenyButton: true,
    denyButtonText: 'Hapus Draft Saja',
    denyButtonColor: '#f59e0b'
  });
  
  if (isConfirmed) {
    updateStatus('loading', 'Menghapus semua data...');
    
    try {
      const result = await callAppScript('clearData');
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      state.dataPanen = [];
      state.detailData = {};
      
      clearDraft();
      
      updateAllViews();
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Semua data berhasil dihapus',
        timer: 3000,
        confirmButtonColor: '#16a34a'
      });
      
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: error.message,
        confirmButtonColor: '#dc2626'
      });
    }
  } else if (isConfirmed === false) {
    clearDraft();
    await Swal.fire({
      icon: 'success',
      title: 'Draft Dihapus',
      text: 'Data draft berhasil dihapus',
      timer: 2000,
      confirmButtonColor: '#16a34a'
    });
  }
}

// ==================== FUNGSI FORM ====================

function createForm() {
  const uniqueId = Date.now() + '-' + Math.floor(Math.random() * 1000);
  const accordion = document.getElementById('accordionPanen');
  
  const item = document.createElement('div');
  item.className = 'accordion-item bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden hover-lift';
  
  item.innerHTML = `
    <button class="accordion-button w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onclick="toggleAccordion(this)">
      <div class="flex items-center gap-3">
        <i class="bi bi-plus-circle text-blue-600 dark:text-blue-400 text-xl"></i>
        <span class="font-medium">Data Pemanen: 
          <span id="preview${uniqueId}" class="text-blue-600 dark:text-blue-400 font-bold ml-2">[Klik untuk isi]</span>
        </span>
      </div>
      <i class="bi bi-chevron-down transition-transform"></i>
    </button>
    
    <div class="accordion-content px-6 py-5 hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nama Pengurus <span class="text-red-500">*</span>
            </label>
            <select class="pengurus w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                    required onchange="updateKavlingOptions(this, '${uniqueId}')">
              <option value="">-- Pilih Pengurus --</option>
              ${pengurusList.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nomor Kavling <span class="text-red-500">*</span>
            </label>
            <select id="kavling${uniqueId}" 
                    class="kavling w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                    required>
              <option value="">-- Pilih Kavling --</option>
            </select>
            <div id="hargaInfo${uniqueId}" class="text-sm text-gray-500 dark:text-gray-400 mt-2 hidden">
              Harga: <span class="font-bold text-green-600 dark:text-green-400">Rp 0/kg</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Panen <span class="text-red-500">*</span>
              </label>
              <input type="date" 
                     class="tanggal w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                     required 
                     value="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Nama Pemanen <span class="text-red-500">*</span>
              </label>
              <input type="text" 
                     class="pemanen w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                     required 
                     oninput="document.getElementById('preview${uniqueId}').textContent=this.value||'[Klik untuk isi]'"
                     placeholder="Nama pemanen">
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tandan Matang
              </label>
              <input type="number" 
                     class="matang w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                     min="0" value="0" placeholder="0" oninput="validateNumber(this)">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tandan Mentah
              </label>
              <input type="number" 
                     class="mentah w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                     min="0" value="0" placeholder="0" oninput="validateNumber(this)">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tandan Busuk
              </label>
              <input type="number" 
                     class="busuk w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                     min="0" value="0" placeholder="0" oninput="validateNumber(this)">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Jangkos
              </label>
              <input type="number" 
                     class="jangkos w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                     min="0" value="0" placeholder="0" oninput="validateNumber(this)">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Berondolan (kg)
            </label>
            <input type="number" 
                   class="berondolan w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-3 focus:ring-green-500 focus:border-transparent transition-colors"
                   min="0" value="0" placeholder="0" oninput="validateNumber(this)">
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div class="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Perkiraan Nilai:</div>
            <div id="nilaiEstimasi${uniqueId}" class="text-2xl font-bold text-green-600 dark:text-green-400">Rp 0</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              *Perhitungan: (25kg × total tandan + berondolan) × harga/kg
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  accordion.appendChild(item);
  return uniqueId;
}

function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('.bi-chevron-down');
  
  content.classList.toggle('hidden');
  icon.classList.toggle('rotate-180');
}

function updateKavlingOptions(selectPengurus, uniqueId) {
  const kavlingSelect = document.getElementById(`kavling${uniqueId}`);
  const hargaInfo = document.getElementById(`hargaInfo${uniqueId}`);
  
  if (!kavlingSelect) return;
  
  kavlingSelect.innerHTML = '<option value="">-- Pilih Kavling --</option>';
  hargaInfo.classList.add('hidden');
  
  if (selectPengurus.value && kelompokKavling[selectPengurus.value]) {
    const { kavling, harga } = kelompokKavling[selectPengurus.value];
    
    kavling.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = `Kavling ${k}`;
      kavlingSelect.appendChild(opt);
    });
    
    hargaInfo.innerHTML = `Harga: <span class="font-bold text-green-600 dark:text-green-400">${formatCurrency(harga)}/kg</span>`;
    hargaInfo.classList.remove('hidden');
  }
  
  calculateFormValue(uniqueId);
}

function calculateFormValue(uniqueId) {
  const form = document.querySelector(`#kavling${uniqueId}`)?.closest('.accordion-item');
  if (!form) return;
  
  const matang = parseInt(form.querySelector('.matang').value) || 0;
  const mentah = parseInt(form.querySelector('.mentah').value) || 0;
  const busuk = parseInt(form.querySelector('.busuk').value) || 0;
  const jangkos = parseInt(form.querySelector('.jangkos').value) || 0;
  const berondolan = parseInt(form.querySelector('.berondolan').value) || 0;
  const pengurus = form.querySelector('.pengurus').value;
  const kavling = form.querySelector('.kavling').value;
  
  const jumlahTandan = matang + mentah + busuk + jangkos;
  const harga = getHargaKavling(pengurus, kavling);
  const beratTandan = jumlahTandan * 25;
  const totalBerat = beratTandan + berondolan;
  const totalNilai = totalBerat * harga;
  
  const nilaiElement = document.getElementById(`nilaiEstimasi${uniqueId}`);
  if (nilaiElement) {
    nilaiElement.textContent = formatCurrency(totalNilai);
  }
}

// ==================== FUNGSI UI ====================

function updateAllViews() {
  const paginatedData = getPaginatedData();
  updateTable(paginatedData);
  updateMobileCards(paginatedData);
  updateSummary();
  updateStatistics();
  updatePagination();
}

function getPaginatedData() {
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  return state.dataPanen.slice(start, end);
}

function updateTable(data) {
  const tabel = document.querySelector('#tabelPanen tbody');
  if (!tabel) return;
  
  tabel.innerHTML = '';
  
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  
  data.forEach((item, index) => {
    const globalIndex = startIndex + index;
    const detail = state.detailData[item.id];
    const totalValue = calculateTotal(item);
    
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 table-row-hover';
    tr.innerHTML = `
      <td class="py-4 px-6 text-center font-medium">${globalIndex + 1}</td>
      <td class="py-4 px-6">
        <div class="font-medium">${formatDate(item.tanggal)}</div>
      </td>
      <td class="py-4 px-6">
        <div class="font-medium">${item.pengurus}</div>
      </td>
      <td class="py-4 px-6">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          ${item.pemanen}
        </span>
      </td>
      <td class="py-4 px-6">
        <div class="font-bold">${item.kavling}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${formatCurrency(totalValue.harga)}/kg</div>
      </td>
      <td class="py-4 px-6 text-center">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          ${item.jumlahTandan}
        </span>
      </td>
      <td class="py-4 px-6 text-center">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          ${item.berondolan} kg
        </span>
      </td>
      <td class="py-4 px-6 text-center">
        <div class="flex items-center justify-center gap-2">
          <button onclick="showDetail('${item.id}')" 
                  class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Detail">
            <i class="bi bi-eye text-lg"></i>
          </button>
          <button onclick="deleteData('${item.id}')" 
                  class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Hapus">
            <i class="bi bi-trash text-lg"></i>
          </button>
        </div>
      </td>
    `;
    tabel.appendChild(tr);
  });
}

function updateMobileCards(data) {
  const mobileCards = document.getElementById('mobileCards');
  if (!mobileCards) return;
  
  if (data.length === 0) {
    mobileCards.innerHTML = `
      <div class="text-center py-12">
        <i class="bi bi-inbox text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400 mb-6 text-lg">Belum ada data panen</p>
        <button onclick="loadData()" 
                class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-3 mx-auto shadow-lg">
          <i class="bi bi-download text-xl"></i> Muat Data
        </button>
      </div>
    `;
    return;
  }
  
  mobileCards.innerHTML = '';
  
  data.forEach((item, index) => {
    const detail = state.detailData[item.id];
    const totalValue = calculateTotal(item);
    
    const card = document.createElement('div');
    card.className = 'mobile-card bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4 shadow-md hover:shadow-xl transition-all';
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="font-bold text-green-700 dark:text-green-400 text-lg">${item.pemanen}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">${formatDate(item.tanggal)}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${item.pengurus}</div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="showDetail('${item.id}')" 
                  class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Detail">
            <i class="bi bi-eye text-xl"></i>
          </button>
          <button onclick="deleteData('${item.id}')" 
                  class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Hapus">
            <i class="bi bi-trash text-xl"></i>
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="text-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
          <div class="text-xs text-gray-500 dark:text-gray-400 font-bold">Kavling</div>
          <div class="font-bold text-lg">${item.kavling}</div>
        </div>
        <div class="text-center bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
          <div class="text-xs text-gray-500 dark:text-gray-400 font-bold">Tandan</div>
          <div class="font-bold text-lg text-blue-600 dark:text-blue-400">${item.jumlahTandan}</div>
        </div>
        <div class="text-center bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
          <div class="text-xs text-gray-500 dark:text-gray-400 font-bold">Berondolan</div>
          <div class="font-bold text-lg text-yellow-600 dark:text-yellow-400">${item.berondolan} kg</div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
        <div class="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Perkiraan Nilai</div>
        <div class="font-bold text-2xl text-green-600 dark:text-green-400">${totalValue.totalValue}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          ${totalValue.totalBerat} kg × ${formatCurrency(totalValue.harga)}/kg
        </div>
      </div>
    `;
    
    mobileCards.appendChild(card);
  });
}

function updateSummary() {
  const totalData = state.dataPanen.length;
  const totalTandan = state.dataPanen.reduce((sum, item) => sum + item.jumlahTandan, 0);
  const totalBerondolan = state.dataPanen.reduce((sum, item) => sum + item.berondolan, 0);
  const totalValue = state.dataPanen.reduce((sum, item) => sum + calculateTotal(item).rupiah, 0);
  
  document.getElementById('totalData').textContent = `${totalData} Data`;
  document.getElementById('summaryTotal').textContent = totalData;
  document.getElementById('summaryTandan').textContent = totalTandan;
  document.getElementById('summaryBerondolan').textContent = `${totalBerondolan} kg`;
  
  const statTotalValue = document.getElementById('statTotalValue');
  if (statTotalValue) {
    statTotalValue.textContent = formatCurrency(totalValue);
  }
}

function updateStatistics() {
  const statsDashboard = document.getElementById('statisticsDashboard');
  if (!statsDashboard) return;
  
  if (state.dataPanen.length === 0) {
    statsDashboard.classList.add('hidden');
    return;
  }
  
  statsDashboard.classList.remove('hidden');
  const statsContainer = statsDashboard.querySelector('.grid');
  
  const totalPemanen = new Set(state.dataPanen.map(item => item.pemanen)).size;
  const totalTandan = state.dataPanen.reduce((sum, item) => sum + item.jumlahTandan, 0);
  const totalBerondolan = state.dataPanen.reduce((sum, item) => sum + item.berondolan, 0);
  const totalValue = state.dataPanen.reduce((sum, item) => sum + calculateTotal(item).rupiah, 0);
  
  const dates = [...new Set(state.dataPanen.map(item => item.tanggal.split('T')[0]))];
  const rataPerHari = dates.length > 0 ? Math.round(totalTandan / dates.length) : 0;
  
  statsContainer.innerHTML = `
    <div class="stat-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow hover-lift">
      <div class="text-center">
        <i class="bi bi-people text-4xl text-green-600 dark:text-green-400 mb-3"></i>
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-200" id="statTotalPemanen">${totalPemanen}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Pemanen</div>
      </div>
    </div>
    
    <div class="stat-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow hover-lift">
      <div class="text-center">
        <i class="bi bi-tree text-4xl text-blue-600 dark:text-blue-400 mb-3"></i>
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-200" id="statTotalTandan">${totalTandan}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tandan</div>
      </div>
    </div>
    
    <div class="stat-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow hover-lift">
      <div class="text-center">
        <i class="bi bi-basket text-4xl text-yellow-600 dark:text-yellow-400 mb-3"></i>
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-200" id="statTotalBerondolan">${totalBerondolan}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">Berondolan (kg)</div>
      </div>
    </div>
    
    <div class="stat-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow hover-lift">
      <div class="text-center">
        <i class="bi bi-cash-coin text-4xl text-purple-600 dark:text-purple-400 mb-3"></i>
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-200" id="statTotalValue">${formatCurrency(totalValue)}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Nilai</div>
      </div>
    </div>
  `;
}

function updatePagination() {
  const totalPages = Math.ceil(state.dataPanen.length / state.itemsPerPage);
  const paginationContainer = document.getElementById('paginationContainer');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  
  if (totalPages > 1) {
    paginationContainer.classList.remove('hidden');
    document.getElementById('currentPage').textContent = state.currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    prevPage.disabled = state.currentPage === 1;
    nextPage.disabled = state.currentPage === totalPages;
  } else {
    paginationContainer.classList.add('hidden');
  }
}

function showDetail(id) {
  const data = state.detailData[id];
  if (!data) {
    Swal.fire({
      icon: 'error',
      title: 'Data Tidak Ditemukan',
      text: 'Data yang diminta tidak ditemukan',
      confirmButtonColor: '#dc2626'
    });
    return;
  }
  
  const totalValue = calculateTotal(data);
  const modal = document.getElementById('detailModal');
  const modalBody = modal.querySelector('.p-8');
  
  modalBody.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">Tanggal</div>
          <div class="font-bold text-lg">${formatDate(data.tanggal)}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">Pengurus</div>
          <div class="font-bold text-lg">${data.pengurus || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">Pemanen</div>
          <div class="font-bold text-lg">${data.pemanen || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">Kavling</div>
          <div class="font-bold text-lg">${data.kavling || '-'}</div>
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl">
        <div class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Detail Tandan</div>
        <div class="grid grid-cols-4 gap-4">
          <div class="text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div class="text-sm font-bold text-green-600 dark:text-green-400">Matang</div>
            <div class="text-2xl font-bold">${data.matang || 0}</div>
          </div>
          <div class="text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <div class="text-sm font-bold text-yellow-600 dark:text-yellow-400">Mentah</div>
            <div class="text-2xl font-bold">${data.mentah || 0}</div>
          </div>
          <div class="text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <div class="text-sm font-bold text-red-600 dark:text-red-400">Busuk</div>
            <div class="text-2xl font-bold">${data.busuk || 0}</div>
          </div>
          <div class="text-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div class="text-sm font-bold text-blue-600 dark:text-blue-400">Jangkos</div>
            <div class="text-2xl font-bold">${data.jangkos || 0}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
        <div class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Ringkasan Nilai</div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Total Tandan:</span>
            <span class="font-bold text-lg">${data.jumlahTandan || 0}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Berondolan:</span>
            <span class="font-bold text-lg">${data.berondolan || 0} kg</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Harga:</span>
            <span class="font-bold text-lg">${formatCurrency(totalValue.harga)}/kg</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Total Berat:</span>
            <span class="font-bold text-lg">${totalValue.totalBerat} kg</span>
          </div>
          <div class="flex justify-between items-center text-xl font-bold text-green-600 dark:text-green-400 border-t border-green-200 dark:border-green-800 pt-3 mt-3">
            <span>Total Nilai:</span>
            <span>${totalValue.totalValue}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

// ==================== DRAFT FUNCTIONS ====================

function saveDraft() {
  const forms = document.querySelectorAll('#accordionPanen .accordion-item');
  if (forms.length === 0) return;
  
  const drafts = [];
  let hasData = false;
  
  forms.forEach(form => {
    const draft = {
      pengurus: form.querySelector('.pengurus')?.value || '',
      tanggal: form.querySelector('.tanggal')?.value || new Date().toISOString().split('T')[0],
      pemanen: form.querySelector('.pemanen')?.value || '',
      kavling: form.querySelector('.kavling')?.value || '',
      matang: form.querySelector('.matang')?.value || '0',
      mentah: form.querySelector('.mentah')?.value || '0',
      busuk: form.querySelector('.busuk')?.value || '0',
      jangkos: form.querySelector('.jangkos')?.value || '0',
      berondolan: form.querySelector('.berondolan')?.value || '0'
    };
    
    if (Object.values(draft).some(value => value && value !== '0' && value !== '')) {
      hasData = true;
      drafts.push(draft);
    }
  });
  
  if (hasData) {
    localStorage.setItem('draft_panen', JSON.stringify(drafts));
    document.getElementById('draftBadge').classList.remove('hidden');
    document.getElementById('loadDraftBtn').classList.remove('hidden');
    state.hasDraft = true;
  } else {
    clearDraft();
  }
}

function checkDraft() {
  const draft = localStorage.getItem('draft_panen');
  if (draft) {
    const drafts = JSON.parse(draft);
    if (drafts.length > 0) {
      state.hasDraft = true;
      document.getElementById('draftBadge').classList.remove('hidden');
      document.getElementById('loadDraftBtn').classList.remove('hidden');
    }
  }
}

function loadDraft() {
  const draft = localStorage.getItem('draft_panen');
  if (!draft) return;
  
  Swal.fire({
    title: 'Load Draft?',
    text: 'Ada data draft yang belum disimpan. Muat kembali?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Muat',
    cancelButtonText: 'Hapus Draft'
  }).then((result) => {
    if (result.isConfirmed) {
      const drafts = JSON.parse(draft);
      
      document.getElementById('accordionPanen').innerHTML = '';
      
      drafts.forEach(draftData => {
        const uniqueId = createForm();
        setTimeout(() => {
          const form = document.querySelector(`#kavling${uniqueId}`)?.closest('.accordion-item');
          if (form) {
            form.querySelector('.pengurus').value = draftData.pengurus || '';
            form.querySelector('.tanggal').value = draftData.tanggal || new Date().toISOString().split('T')[0];
            form.querySelector('.pemanen').value = draftData.pemanen || '';
            form.querySelector('.kavling').value = draftData.kavling || '';
            form.querySelector('.matang').value = draftData.matang || '0';
            form.querySelector('.mentah').value = draftData.mentah || '0';
            form.querySelector('.busuk').value = draftData.busuk || '0';
            form.querySelector('.jangkos').value = draftData.jangkos || '0';
            form.querySelector('.berondolan').value = draftData.berondolan || '0';
            
            const preview = document.getElementById(`preview${uniqueId}`);
            if (preview && draftData.pemanen) {
              preview.textContent = draftData.pemanen;
            }
            
            if (draftData.pengurus) {
              updateKavlingOptions(form.querySelector('.pengurus'), uniqueId);
              form.querySelector('.kavling').value = draftData.kavling || '';
            }
            
            calculateFormValue(uniqueId);
          }
        }, 100);
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Draft Dimuat',
        text: `${drafts.length} data draft berhasil dimuat`,
        timer: 2000,
        confirmButtonColor: '#16a34a'
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      clearDraft();
    }
  });
}

function clearDraft() {
  localStorage.removeItem('draft_panen');
  document.getElementById('draftBadge').classList.add('hidden');
  document.getElementById('loadDraftBtn').classList.add('hidden');
  state.hasDraft = false;
}

// ==================== DARK MODE ====================

function toggleDarkMode() {
  state.isDarkMode = !state.isDarkMode;
  
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
    document.getElementById('darkModeToggle').innerHTML = '<i class="bi bi-sun text-xl"></i>';
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    document.getElementById('darkModeToggle').innerHTML = '<i class="bi bi-moon text-xl"></i>';
    localStorage.setItem('darkMode', 'false');
  }
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', function() {
  // Set dark mode
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
    document.getElementById('darkModeToggle').innerHTML = '<i class="bi bi-sun text-xl"></i>';
  }
  
  // Buat form pertama
  createForm();
  
  // Load draft jika ada
  checkDraft();
  
  // Auto-load data saat halaman dimuat
  setTimeout(() => loadData(), 1000);
  
  // Auto-save draft setiap 30 detik
  setInterval(saveDraft, 30000);
  
  // Setup event listeners
  document.getElementById('addData').addEventListener('click', () => createForm());
  document.getElementById('loadData').addEventListener('click', () => loadData());
  document.getElementById('saveData').addEventListener('click', () => saveData());
  document.getElementById('loadDraftBtn').addEventListener('click', () => loadDraft());
  document.getElementById('clearAllBtn').addEventListener('click', () => clearAllData());
  document.getElementById('darkModeToggle').addEventListener('click', () => toggleDarkMode());
  
  // Pagination
  document.getElementById('prevPage').addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      updateAllViews();
    }
  });
  
  document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(state.dataPanen.length / state.itemsPerPage);
    if (state.currentPage < totalPages) {
      state.currentPage++;
      updateAllViews();
    }
  });
  
  // Modal close
  document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('detailModal').classList.add('hidden');
  });
  
  // Close modal on backdrop click
  document.getElementById('detailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
      e.target.classList.add('hidden');
    }
  });
  
  // Auto-save draft saat form berubah
  document.getElementById('accordionPanen')?.addEventListener('input', () => {
    saveDraft();
  });
  
  // Auto-calculate form values
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('matang') || 
        e.target.classList.contains('mentah') ||
        e.target.classList.contains('busuk') ||
        e.target.classList.contains('jangkos') ||
        e.target.classList.contains('berondolan') ||
        e.target.classList.contains('pengurus') ||
        e.target.classList.contains('kavling')) {
      
      const form = e.target.closest('.accordion-item');
      const uniqueId = form?.querySelector('[id^="kavling"]')?.id.replace('kavling', '');
      if (uniqueId) {
        calculateFormValue(uniqueId);
      }
    }
  });
});
