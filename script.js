// ==================== KONFIGURASI ====================
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEpmBkcYm0IwkYrShx931lJjsSdnlocPeQ-N8zgX84kKfxny1CboCTZiPBoXTw9yj2cw/exec";

// Daftar kelompok dengan kavling
const kelompokKavling = {
  'KLP 37 - Huda & Welly': ["851", "852", "853", "854", "855", "856", "857", "858", "859", "860", "861", "862", "863", "864", "865", "866", "867", "868", "869", "870", "871", "872", "873", "874", "908"],
  'KLP 38 - Slamet & Ari M': ["875", "876", "877", "878", "879", "880", "881", "975", "976", "980", "981", "982", "983", "984", "985", "986", "987", "988", "989", "990", "996", "997", "998", "999", "1000"],
  'KLP 39 - Iis & Ahmadi': ["882", "950", "951", "952", "953", "954", "955", "956", "957", "958", "959", "960", "961", "962", "963", "964", "965", "966", "967", "968", "969", "977", "978", "979", "1040"],
  'KLP 40 - Wahyudi & Aswan': ["1006", "1007", "1008", "1009", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1031", "1032", "1033", "1034", "1035", "1036", "1037", "1038", "1039", "1040"],
  'KLP 41 - Suwat & Harnidi': ["995", "994", "993", "992", "991", "970", "971", "972", "973", "974", "1001", "1002", "1003", "1004", "1005", "1021", "1022", "1023", "1024", "1025", "1026", "1027", "1028", "1029", "1030"],
  'KLP 42 - Suparno & Siswo': ["1042", "1043", "1044", "1045", "1046", "1047", "1048", "1049", "1050", "1051", "1052", "1053", "1054", "1055", "1056", "1057", "1058", "1059", "1060", "1061", "1062", "1063", "1064", "1065", "1066"],
  'KLP 43 - Suganda & Budi': ["1067", "1068", "1069", "1070", "1073", "1074", "1075", "1076", "1077", "1078", "1079", "1080", "1081", "1082", "1083", "1084", "1097", "1098", "1099", "1100", "1101", "1102", "1103", "1104", "1105"],
  'KLP 44 - Siswanto & Ahmad': ["1071", "1072", "1085", "1086", "1087", "1088", "1089", "1090", "1091", "1092", "1093", "1094", "1095", "1096", "1106", "1107", "1108", "1109", "1110", "1111", "1112", "1113", "1131", "1132", "1133"],
  'KLP 45 - Dedi & Ely': ["1114", "1115", "1116", "1117", "1128", "1127", "1129", "1130", "1134", "1135", "1137", "1139", "1140", "1141", "1149", "1150", "1151", "1152", "1154", "1156", "1157", "1155", "1166"],
  'KLP 46 - Supardi & Maryanto': ["1118", "1119", "1120", "1123", "1124", "1125", "1126", "1142", "1143", "1144", "1145", "1146", "1147", "1148", "1158", "1159", "1160", "1161", "1162", "1163", "1164", "1165", "1166"],
  'KLP 47 - Yusuf & Ngatijo': ["1167", "1168", "1169", "1170", "1174", "1175", "1176", "1177", "1179", "1180", "1181", "1182", "1183", "1184", "1185", "1186", "1187", "1188", "1189", "1190", "1191", "1192", "1193", "1194"],
  'KLP 48 - Rukito & Goklas': ["1171", "1172", "1173", "1195", "1196", "1198", "1199", "1200", "1201", "1202", "1203", "1204", "1205", "1206", "1207", "1208", "1210", "1211", "1212", "1213", "1214", "1215", "1216"]
};

const pengurusList = Object.keys(kelompokKavling);

// ==================== STATE GLOBAL ====================
const state = {
  dataPanen: [],
  detailData: {},
  currentPage: 1,
  itemsPerPage: 15,
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

function validateNumber(input) {
  if (input.value < 0) {
    input.value = 0;
  }
}

function showSkeletonLoader() {
  const tabel = document.querySelector('#tabelPanen tbody');
  const mobileDropdown = document.getElementById('mobileDropdown');
  
  if (tabel) {
    tabel.innerHTML = `
      ${Array(3).fill().map(() => `
        <tr>
          ${Array(8).fill().map(() => `
            <td class="py-2 px-3"><div class="skeleton-item h-5 rounded"></div></td>
          `).join('')}
        </tr>
      `).join('')}
    `;
  }
  
  if (mobileDropdown) {
    mobileDropdown.innerHTML = `
      <div class="p-3 space-y-3">
        ${Array(3).fill().map(() => `
          <div class="skeleton-item h-16 rounded"></div>
        `).join('')}
      </div>
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
      statusText.className = 'text-green-600 dark:text-green-400';
      syncStatus.innerHTML = '<i class="bi bi-cloud-check"></i> Terhubung';
      syncStatus.className = 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium dark:bg-green-900 dark:text-green-300';
      break;
    case 'loading':
      statusText.className = 'text-yellow-600 dark:text-yellow-400';
      syncStatus.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Memuat';
      syncStatus.className = 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium dark:bg-yellow-900 dark:text-yellow-300';
      break;
    default:
      statusText.className = 'text-red-600 dark:text-red-400';
      syncStatus.innerHTML = '<i class="bi bi-cloud-slash"></i> Offline';
      syncStatus.className = 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium dark:bg-red-900 dark:text-red-300';
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
    updateStatus('connected', `${result.count} data`);
    
    return true;
    
  } catch (error) {
    updateStatus('disconnected', error.message);
    
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Data',
      text: error.message,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'OK'
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
    confirmButtonText: 'Ya, Simpan',
    cancelButtonText: 'Batal'
  });
  
  if (!confirmSave) return;
  
  state.isSubmitting = true;
  updateStatus('loading', 'Menyimpan...');
  
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
        html: `${successful.length} data berhasil disimpan<br>${failed.length} data gagal`,
        confirmButtonColor: '#f59e0b'
      });
    } else {
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${results.length} data tersimpan`,
        timer: 2000,
        confirmButtonColor: '#16a34a'
      });
    }
    
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: error.message,
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
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  });
  
  if (!isConfirmed) return;
  
  updateStatus('loading', 'Menghapus...');
  
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
      text: 'Data dihapus',
      timer: 1500,
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
    title: 'Hapus Semua Data?',
    text: "Semua data akan dihapus permanen!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3b82f6',
    confirmButtonText: 'Ya, Hapus Semua',
    cancelButtonText: 'Batal'
  });
  
  if (!isConfirmed) return;
  
  updateStatus('loading', 'Menghapus...');
  
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
      text: 'Semua data dihapus',
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

// ==================== FUNGSI FORM ====================

function createForm() {
  const uniqueId = Date.now() + '-' + Math.floor(Math.random() * 1000);
  const accordion = document.getElementById('accordionPanen');
  
  const item = document.createElement('div');
  item.className = 'accordion-item bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 mb-3 overflow-hidden';
  
  item.innerHTML = `
    <button class="accordion-button w-full px-3 py-3 bg-gray-50 dark:bg-gray-900 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700"
            onclick="toggleAccordion(this)">
      <div class="flex items-center gap-2">
        <i class="bi bi-plus-circle text-blue-600 dark:text-blue-400"></i>
        <span class="text-sm dark:text-gray-200">Pemanen: 
          <span id="preview${uniqueId}" class="text-blue-600 dark:text-blue-400 font-medium">[belum diisi]</span>
        </span>
      </div>
      <i class="bi bi-chevron-down text-xs transition-transform dark:text-gray-400"></i>
    </button>
    
    <div class="accordion-content px-3 py-3 hidden">
      <div class="space-y-3">
        <!-- NAMA PEMANEN DI AWAL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Pemanen <span class="text-red-500">*</span>
          </label>
          <input type="text" 
                 class="pemanen w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                 required 
                 oninput="document.getElementById('preview${uniqueId}').textContent=this.value||'[belum diisi]'"
                 placeholder="Masukkan nama pemanen">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kelompok <span class="text-red-500">*</span>
          </label>
          <select class="pengurus w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  required onchange="updateKavlingOptions(this, '${uniqueId}')">
            <option value="">-- Pilih Kelompok --</option>
            ${pengurusList.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kavling <span class="text-red-500">*</span>
          </label>
          <select id="kavling${uniqueId}" 
                  class="kavling w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  required>
            <option value="">-- Pilih Kavling --</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tanggal <span class="text-red-500">*</span>
          </label>
          <input type="date" 
                 class="tanggal w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                 required 
                 value="${new Date().toISOString().split('T')[0]}">
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tandan Matang
            </label>
            <input type="number" 
                   class="matang w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                   min="0" value="0" placeholder="0" oninput="validateNumber(this)">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tandan Mentah
            </label>
            <input type="number" 
                   class="mentah w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                   min="0" value="0" placeholder="0" oninput="validateNumber(this)">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tandan Busuk
            </label>
            <input type="number" 
                   class="busuk w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                   min="0" value="0" placeholder="0" oninput="validateNumber(this)">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jangkos
            </label>
            <input type="number" 
                   class="jangkos w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                   min="0" value="0" placeholder="0" oninput="validateNumber(this)">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Berondolan (kg)
          </label>
          <input type="number" 
                 class="berondolan w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                 min="0" value="0" placeholder="0" oninput="validateNumber(this)">
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
  
  if (!kavlingSelect) return;
  
  kavlingSelect.innerHTML = '<option value="">-- Pilih Kavling --</option>';
  
  if (selectPengurus.value && kelompokKavling[selectPengurus.value]) {
    const kavling = kelompokKavling[selectPengurus.value];
    
    kavling.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = k;
      kavlingSelect.appendChild(opt);
    });
  }
}

// ==================== FUNGSI UI ====================

function updateAllViews() {
  const paginatedData = getPaginatedData();
  updateDesktopTable(paginatedData);
  updateMobileDropdown();
  updateSummary();
  updatePagination();
}

function getPaginatedData() {
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  return state.dataPanen.slice(start, end);
}

function updateDesktopTable(data) {
  const tabel = document.querySelector('#tabelPanen tbody');
  if (!tabel) return;
  
  tabel.innerHTML = '';
  
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  
  data.forEach((item, index) => {
    const globalIndex = startIndex + index;
    
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50';
    tr.innerHTML = `
      <td class="py-2 px-3 text-center text-sm dark:text-gray-300">${globalIndex + 1}</td>
      <td class="py-2 px-3 text-sm dark:text-gray-300">${formatDate(item.tanggal)}</td>
      <td class="py-2 px-3">
        <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs dark:bg-green-900 dark:text-green-300">
          ${item.pemanen}
        </span>
      </td>
      <td class="py-2 px-3 text-xs dark:text-gray-400">${item.pengurus}</td>
      <td class="py-2 px-3 text-sm font-medium dark:text-gray-300">${item.kavling}</td>
      <td class="py-2 px-3 text-center">
        <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900 dark:text-blue-300">
          ${item.jumlahTandan}
        </span>
      </td>
      <td class="py-2 px-3 text-center">
        <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs dark:bg-yellow-900 dark:text-yellow-300">
          ${item.berondolan} kg
        </span>
      </td>
      <td class="py-2 px-3 text-center">
        <div class="flex items-center justify-center gap-1">
          <button onclick="showDetail('${item.id}')" 
                  class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Detail">
            <i class="bi bi-eye"></i>
          </button>
          <button onclick="deleteData('${item.id}')" 
                  class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Hapus">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabel.appendChild(tr);
  });
}

function updateMobileDropdown() {
  const mobileDropdown = document.getElementById('mobileDropdown');
  if (!mobileDropdown) return;
  
  if (state.dataPanen.length === 0) {
    mobileDropdown.innerHTML = `
      <div class="text-center py-6 px-3">
        <i class="bi bi-inbox text-3xl text-gray-400 dark:text-gray-600 mb-2"></i>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada data</p>
        <button onclick="loadData()" 
                class="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
          <i class="bi bi-download me-1"></i> Muat Data
        </button>
      </div>
    `;
    return;
  }
  
  // Kelompokkan data berdasarkan pemanen
  const groupedByPemanen = {};
  state.dataPanen.forEach(item => {
    if (!groupedByPemanen[item.pemanen]) {
      groupedByPemanen[item.pemanen] = [];
    }
    groupedByPemanen[item.pemanen].push(item);
  });
  
  // Urutkan nama pemanen
  const sortedPemanen = Object.keys(groupedByPemanen).sort();
  
  let html = '<div class="divide-y divide-gray-200 dark:divide-gray-700">';
  
  sortedPemanen.forEach((pemanen, index) => {
    const items = groupedByPemanen[pemanen];
    const totalTandan = items.reduce((sum, item) => sum + item.jumlahTandan, 0);
    const totalBerondolan = items.reduce((sum, item) => sum + item.berondolan, 0);
    const totalItems = items.length;
    
    html += `
      <div class="border-b border-gray-200 dark:border-gray-700">
        <button class="mobile-dropdown-toggle w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onclick="toggleMobileDropdown('mobile-dropdown-${index}')">
          <div class="flex-1">
            <div class="font-medium text-green-700 dark:text-green-400">${pemanen}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ${totalItems} data • ${totalTandan} tandan • ${totalBerondolan} kg
            </div>
          </div>
          <i class="bi bi-chevron-down text-sm transition-transform dark:text-gray-400"></i>
        </button>
        
        <div id="mobile-dropdown-${index}" class="mobile-dropdown-content bg-gray-50 dark:bg-gray-800/30">
          <div class="px-4 py-3">
            ${items.map(item => {
              const detail = state.detailData[item.id];
              return `
                <div class="mb-3 last:mb-0 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-start mb-2">
                    <div class="text-xs text-gray-500 dark:text-gray-400">${formatDate(item.tanggal)}</div>
                    <div class="flex gap-1">
                      <button onclick="showDetail('${item.id}')" 
                              class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Detail">
                        <i class="bi bi-eye text-xs"></i>
                      </button>
                      <button onclick="deleteData('${item.id}')" 
                              class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Hapus">
                        <i class="bi bi-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2 mb-2 text-xs">
                    <div>
                      <div class="text-gray-500 dark:text-gray-400">Kelompok</div>
                      <div class="font-medium dark:text-gray-300 truncate" title="${item.pengurus}">${item.pengurus.split(' - ')[0]}</div>
                    </div>
                    <div>
                      <div class="text-gray-500 dark:text-gray-400">Kavling</div>
                      <div class="font-medium dark:text-gray-300">${item.kavling}</div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2">
                    <div class="text-center">
                      <div class="text-xs text-gray-500 dark:text-gray-400">Tandan</div>
                      <div class="font-medium text-blue-600 dark:text-blue-400">${item.jumlahTandan}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500 dark:text-gray-400">Berondolan</div>
                      <div class="font-medium text-yellow-600 dark:text-yellow-400">${item.berondolan} kg</div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  mobileDropdown.innerHTML = html;
}

function toggleMobileDropdown(id) {
  const dropdown = document.getElementById(id);
  const icon = dropdown.previousElementSibling.querySelector('.bi-chevron-down');
  
  dropdown.classList.toggle('show');
  icon.classList.toggle('rotate-180');
}

function updateSummary() {
  const totalData = state.dataPanen.length;
  const totalTandan = state.dataPanen.reduce((sum, item) => sum + item.jumlahTandan, 0);
  const totalBerondolan = state.dataPanen.reduce((sum, item) => sum + item.berondolan, 0);
  
  document.getElementById('totalData').textContent = `${totalData} Data`;
  document.getElementById('summaryTotal').textContent = totalData;
  document.getElementById('summaryTandan').textContent = totalTandan;
  document.getElementById('summaryBerondolan').textContent = `${totalBerondolan} kg`;
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
  
  const modal = document.getElementById('detailModal');
  const modalBody = modal.querySelector('.p-4');
  
  modalBody.innerHTML = `
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Tanggal</div>
          <div class="font-medium dark:text-gray-300">${formatDate(data.tanggal)}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Kelompok</div>
          <div class="font-medium dark:text-gray-300">${data.pengurus || '-'}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Pemanen</div>
          <div class="font-medium dark:text-gray-300">${data.pemanen || '-'}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Kavling</div>
          <div class="font-medium dark:text-gray-300">${data.kavling || '-'}</div>
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
        <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Detail Tandan</div>
        <div class="grid grid-cols-4 gap-2">
          <div class="text-center">
            <div class="text-xs text-green-600 dark:text-green-400">Matang</div>
            <div class="font-bold dark:text-gray-300">${data.matang || 0}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-yellow-600 dark:text-yellow-400">Mentah</div>
            <div class="font-bold dark:text-gray-300">${data.mentah || 0}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-red-600 dark:text-red-400">Busuk</div>
            <div class="font-bold dark:text-gray-300">${data.busuk || 0}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-blue-600 dark:text-blue-400">Jangkos</div>
            <div class="font-bold dark:text-gray-300">${data.jangkos || 0}</div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div class="text-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          <div class="text-xs text-gray-500 dark:text-gray-400">Total Tandan</div>
          <div class="font-bold text-blue-600 dark:text-blue-400">${data.jumlahTandan || 0}</div>
        </div>
        <div class="text-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
          <div class="text-xs text-gray-500 dark:text-gray-400">Berondolan</div>
          <div class="font-bold text-yellow-600 dark:text-yellow-400">${data.berondolan || 0} kg</div>
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
    title: 'Muat Draft?',
    text: 'Ada data draft yang belum disimpan.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Muat',
    cancelButtonText: 'Hapus'
  }).then((result) => {
    if (result.isConfirmed) {
      const drafts = JSON.parse(draft);
      
      document.getElementById('accordionPanen').innerHTML = '';
      
      drafts.forEach(draftData => {
        const uniqueId = createForm();
        setTimeout(() => {
          const form = document.querySelector(`#kavling${uniqueId}`)?.closest('.accordion-item');
          if (form) {
            form.querySelector('.pemanen').value = draftData.pemanen || '';
            form.querySelector('.pengurus').value = draftData.pengurus || '';
            form.querySelector('.tanggal').value = draftData.tanggal || new Date().toISOString().split('T')[0];
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
          }
        }, 100);
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Draft Dimuat',
        text: `${drafts.length} data`,
        timer: 1500,
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
    document.getElementById('darkModeToggle').innerHTML = '<i class="bi bi-sun"></i>';
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    document.getElementById('darkModeToggle').innerHTML = '<i class="bi bi-moon"></i>';
    localStorage.setItem('darkMode', 'false');
  }
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', function() {
  // Set dark mode
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
    document.getElementById('darkModeToggle').innerHTML = '<i class="bi bi-sun"></i>';
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
});