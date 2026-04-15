// DOM 요소
const dragDropArea = document.getElementById('dragDropArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const changeFileBtn = document.getElementById('changeFileBtn');
const convertBtn = document.getElementById('convertBtn');
const convertBtnText = document.getElementById('convertBtnText');
const spinner = document.getElementById('spinner');
const speedCheckboxes = document.querySelectorAll('.speed-checkbox');
const language = document.getElementById('language');
const statusContainer = document.getElementById('statusContainer');
const statusMessage = document.getElementById('statusMessage');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const newConvertBtn = document.getElementById('newConvertBtn');
const successMessage = document.getElementById('successMessage');

let selectedFile = null;

// 이벤트 리스너
dragDropArea.addEventListener('click', () => fileInput.click());
dragDropArea.addEventListener('dragover', handleDragOver);
dragDropArea.addEventListener('dragleave', handleDragLeave);
dragDropArea.addEventListener('drop', handleDrop);

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

changeFileBtn.addEventListener('click', () => fileInput.click());
convertBtn.addEventListener('click', handleConvert);
newConvertBtn.addEventListener('click', resetForm);

// 드래그 오버
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.add('dragover');
}

// 드래그 리브
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.remove('dragover');
}

// 파일 드롭
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
}

// 파일 선택
function handleFileSelect(file) {
    // 파일 형식 확인
    const allowedTypes = ['.txt', '.docx', '.pdf', '.doc'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileExt)) {
        showStatus('지원되지 않는 파일 형식입니다. (.txt, .docx, .pdf만 가능)', 'error');
        return;
    }

    // 파일 크기 확인 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        showStatus('파일 크기는 50MB를 초과할 수 없습니다.', 'error');
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;

    // UI 업데이트
    dragDropArea.style.display = 'none';
    fileInfo.style.display = 'flex';
    convertBtn.disabled = false;
    convertBtnText.textContent = '음성으로 변환';

    hideStatus();
    hideDownloadSection();
}

// 변환 처리
async function handleConvert() {
    if (!selectedFile) {
        showStatus('파일을 선택해주세요.', 'error');
        return;
    }

    // 선택된 속도 확인
    const selectedSpeeds = Array.from(speedCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedSpeeds.length === 0) {
        showStatus('최소 1가지 속도는 선택해주세요.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('speeds', JSON.stringify(selectedSpeeds));
    formData.append('lang', language.value);

    // 버튼 비활성화
    convertBtn.disabled = true;
    convertBtnText.textContent = '변환 중입니다...';
    spinner.style.display = 'inline-block';

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('변환이 완료되었습니다!', 'success');
            handleConvertSuccess(data);
        } else {
            showStatus(`오류: ${data.error}`, 'error');
            convertBtn.disabled = false;
            convertBtnText.textContent = '음성으로 변환';
            spinner.style.display = 'none';
        }
    } catch (error) {
        showStatus(`오류 발생: ${error.message}`, 'error');
        convertBtn.disabled = false;
        convertBtnText.textContent = '음성으로 변환';
        spinner.style.display = 'none';
    }
}

// 변환 성공
function handleConvertSuccess(data) {
    downloadBtn.href = data.download_url;
    downloadBtn.download = data.filename;

    let message = `파일명: ${data.filename}`;
    if (data.files) {
        message += `\n생성된 버전: ${data.files.join(', ')}`;
    }
    successMessage.textContent = message;

    hideDownloadSection();
    setTimeout(() => {
        downloadSection.style.display = 'block';
        convertBtn.disabled = false;
        convertBtnText.textContent = '음성으로 변환';
        spinner.style.display = 'none';
    }, 300);
}

// 상태 메시지 표시
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusContainer.style.display = 'block';
}

// 상태 메시지 숨김
function hideStatus() {
    statusContainer.style.display = 'none';
}

// 다운로드 섹션 숨김
function hideDownloadSection() {
    downloadSection.style.display = 'none';
}

// 폼 초기화
function resetForm() {
    selectedFile = null;
    fileInput.value = '';

    // UI 초기화
    dragDropArea.style.display = 'block';
    fileInfo.style.display = 'none';
    convertBtn.disabled = true;
    convertBtnText.textContent = '파일 선택 후 변환';
    spinner.style.display = 'none';

    hideStatus();
    hideDownloadSection();

    slowSpeed.checked = false;
    language.value = 'ko';
}

// 페이지 로드 시 서버 상태 확인
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/status');
        if (!response.ok) {
            showStatus('서버에 연결할 수 없습니다.', 'error');
        }
    } catch (error) {
        showStatus('서버에 연결할 수 없습니다.', 'error');
    }
});
