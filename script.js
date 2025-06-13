// 아이 수정 (개선된 구현)
function editChild(id) {
    const child = childrenData.find(c => c.id === id);
    if (!child) return;
    
    // 수정 폼을 모달로 생성
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.style.display = 'block';
    
    editModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                ✏️ 아이 정보 수정
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>아이 이름</label>
                    <input type="text" id="editChildName" value="${child.name}" style="font-size: 20px;">
                </div>
                <div class="form-group">
                    <label>등원 시간</label>
                    <input type="time" id="editGoSchoolTime" value="${child.goSchool.time}" style="font-size: 20px;">
                </div>
                <div class="form-group">
                    <label>등원 장소</label>
                    <input type="text" id="editGoSchoolLocation" value="${child.goSchool.location}" style="font-size: 20px;">
                </div>
                <div class="form-group">
                    <label>하원 시간</label>
                    <input type="time" id="editGoHomeTime" value="${child.goHome.time}" style="font-size: 20px;">
                </div>
                <div class="form-group">
                    <label>하원 장소</label>
                    <input type="text" id="editGoHomeLocation" value="${child.goHome.location}" style="font-size: 20px;">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-success" onclick="saveEditChild(${child.id})">저장</button>
                    <button class="btn btn-danger" onclick="this.closest('.modal').remove()">취소</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(editModal);
}

// 수정된 아이 정보 저장
function saveEditChild(id) {
    const child = childrenData.find(c => c.id === id);
    if (!child) return;
    
    const name = document.getElementById('editChildName').value.trim();
    const goSchoolTime = document.getElementById('editGoSchoolTime').value;
    const go// 데이터 저장소
let childrenData = [];
let settings = {
    driverName: '김운전',
    busNumber: '1호차'
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateDateTime();
    updateDriverInfo();
    setInterval(updateDateTime, 1000); // 1초마다 시간 업데이트
    
    // 화면 꺼짐 방지
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen');
    }
    
    // Service Worker 등록 (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker 등록 성공:', registration);
            })
            .catch(function(error) {
                console.log('Service Worker 등록 실패:', error);
            });
    }
});

// 데이터 로드
function loadData() {
    const savedData = localStorage.getItem('kindergartenBusData');
    const savedSettings = localStorage.getItem('kindergartenBusSettings');
    
    if (savedData) {
        childrenData = JSON.parse(savedData);
    } else {
        // 초기 데모 데이터
        childrenData = [
            {
                id: 1,
                name: '김민수',
                goSchool: { time: '08:30', location: '아파트 정문' },
                goHome: { time: '14:30', location: '아파트 정문' }
            },
            {
                id: 2,
                name: '이하늘',
                goSchool: { time: '08:35', location: '놀이터' },
                goHome: { time: '14:35', location: '놀이터' }
            },
            {
                id: 3,
                name: '박지우',
                goSchool: { time: '08:45', location: '204동' },
                goHome: { time: '14:45', location: '204동' }
            }
        ];
    }
    
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    }
}

// 데이터 저장
function saveData() {
    localStorage.setItem('kindergartenBusData', JSON.stringify(childrenData));
    localStorage.setItem('kindergartenBusSettings', JSON.stringify(settings));
}

// 시간 업데이트
function updateDateTime() {
    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours < 12 ? '오전' : '오후';
    const displayHours = hours % 12 || 12;
    
    document.getElementById('dateTime').textContent = `${year}년 ${month}월 ${date}일 (${day})`;
    document.getElementById('currentTime').textContent = `${ampm} ${displayHours}:${minutes}`;
}

// 운전기사 정보 업데이트
function updateDriverInfo() {
    document.getElementById('driverName').textContent = settings.driverName;
    document.getElementById('busNumber').textContent = settings.busNumber;
}

// 모달 열기
function openModal(type) {
    const modal = document.getElementById(type === 'go-school' ? 'goSchoolModal' : 
                                       type === 'go-home' ? 'goHomeModal' : 'manageModal');
    modal.style.display = 'block';
    
    if (type === 'go-school') {
        renderGoSchoolList();
    } else if (type === 'go-home') {
        renderGoHomeList();
    } else if (type === 'manage') {
        renderManageList();
    }
}

// 모달 닫기
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    hideAllForms();
}

// 등원 리스트 렌더링
function renderGoSchoolList() {
    const container = document.getElementById('goSchoolList');
    
    if (childrenData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">👶</div>
                <div class="message">등록된 아이가 없습니다.<br>관리 메뉴에서 아이를 추가해주세요.</div>
            </div>
        `;
        return;
    }
    
    // 시간순으로 정렬
    const sortedData = [...childrenData].sort((a, b) => a.goSchool.time.localeCompare(b.goSchool.time));
    
    container.innerHTML = sortedData.map(child => `
        <div class="list-item">
            <div class="name-time">
                <div class="child-name">${child.name}</div>
                <div class="time">오전 ${child.goSchool.time}</div>
            </div>
            <div class="location">📍 ${child.goSchool.location}</div>
        </div>
    `).join('');
}

// 하원 리스트 렌더링
function renderGoHomeList() {
    const container = document.getElementById('goHomeList');
    
    if (childrenData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">👶</div>
                <div class="message">등록된 아이가 없습니다.<br>관리 메뉴에서 아이를 추가해주세요.</div>
            </div>
        `;
        return;
    }
    
    // 시간순으로 정렬
    const sortedData = [...childrenData].sort((a, b) => a.goHome.time.localeCompare(b.goHome.time));
    
    container.innerHTML = sortedData.map(child => `
        <div class="list-item">
            <div class="name-time">
                <div class="child-name">${child.name}</div>
                <div class="time">오후 ${child.goHome.time}</div>
            </div>
            <div class="location">📍 ${child.goHome.location}</div>
        </div>
    `).join('');
}

// 관리 리스트 렌더링
function renderManageList() {
    const container = document.getElementById('childrenList');
    
    if (childrenData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">👶</div>
                <div class="message">등록된 아이가 없습니다.<br>위의 "아이 추가" 버튼을 눌러 추가해주세요.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <h3 style="margin: 20px 0; color: #2d3748; font-size: 20px;">등록된 아이들</h3>
        ${childrenData.map(child => `
            <div class="list-item">
                <div class="child-name">${child.name}</div>
                <div style="margin-top: 10px; font-size: 20px; color: #718096;">
                    <div>등원: ${child.goSchool.time} | ${child.goSchool.location}</div>
                    <div>하원: ${child.goHome.time} | ${child.goHome.location}</div>
                </div>
                <div style="margin-top: 15px;">
                    <button class="btn btn-primary" onclick="editChild(${child.id})" style="margin-right: 10px; font-size: 18px; padding: 8px 15px;">수정</button>
                    <button class="btn btn-danger" onclick="deleteChild(${child.id})" style="font-size: 18px; padding: 8px 15px;">삭제</button>
                </div>
            </div>
        `).join('')}
    `;
}

// 폼 표시/숨김 관련 함수들
function hideAllForms() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'none';
}

function showAddForm() {
    hideAllForms();
    document.getElementById('addForm').style.display = 'block';
    clearAddForm();
}

function showSettings() {
    hideAllForms();
    document.getElementById('settingsForm').style.display = 'block';
    document.getElementById('settingDriverName').value = settings.driverName;
    document.getElementById('settingBusNumber').value = settings.busNumber;
}

function clearAddForm() {
    document.getElementById('childName').value = '';
    document.getElementById('goSchoolTime').value = '08:00';
    document.getElementById('goSchoolLocation').value = '';
    document.getElementById('goHomeTime').value = '14:00';
    document.getElementById('goHomeLocation').value = '';
}

function cancelAdd() {
    hideAllForms();
    renderManageList();
}

function cancelSettings() {
    hideAllForms();
}

// 커스텀 alert 함수
function showAlert(message) {
    // 기존 알림이 있다면 제거
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 새로운 알림 생성
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        text-align: center;
        min-width: 300px;
        max-width: 90%;
    `;
    
    alertDiv.innerHTML = `
        <div style="font-size: 20px; color: #2d3748; margin-bottom: 20px; line-height: 1.5;">
            ${message}
        </div>
        <button onclick="this.parentElement.remove()" style="
            background: #4299e1;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
        ">확인</button>
    `;
    
    document.body.appendChild(alertDiv);
}

// 커스텀 confirm 함수
function showConfirm(message, callback) {
    // 기존 알림이 있다면 제거
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 새로운 확인창 생성
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'custom-alert';
    confirmDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        text-align: center;
        min-width: 300px;
        max-width: 90%;
    `;
    
    confirmDiv.innerHTML = `
        <div style="font-size: 20px; color: #2d3748; margin-bottom: 20px; line-height: 1.5;">
            ${message}
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="this.parentElement.parentElement.remove(); (${callback})(true)" style="
                background: #f56565;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
            ">확인</button>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #718096;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
            ">취소</button>
        </div>
    `;
    
    document.body.appendChild(confirmDiv);
}
// 아이 저장
function saveChild() {
    const name = document.getElementById('childName').value.trim();
    const goSchoolTime = document.getElementById('goSchoolTime').value;
    const goSchoolLocation = document.getElementById('goSchoolLocation').value.trim();
    const goHomeTime = document.getElementById('goHomeTime').value;
    const goHomeLocation = document.getElementById('goHomeLocation').value.trim();
    
    if (!name || !goSchoolLocation || !goHomeLocation) {
        showAlert('모든 필드를 입력해주세요.');
        return;
    }
    
    const newChild = {
        id: Date.now(),
        name: name,
        goSchool: { time: goSchoolTime, location: goSchoolLocation },
        goHome: { time: goHomeTime, location: goHomeLocation }
    };
    
    childrenData.push(newChild);
    saveData();
    hideAllForms();
    renderManageList();
    showAlert('아이 정보가 저장되었습니다.');
}

// 설정 저장
function saveSettings() {
    const driverName = document.getElementById('settingDriverName').value.trim();
    const busNumber = document.getElementById('settingBusNumber').value.trim();
    
    if (!driverName || !busNumber) {
        showAlert('모든 필드를 입력해주세요.');
        return;
    }
    
    settings.driverName = driverName;
    settings.busNumber = busNumber;
    saveData();
    updateDriverInfo();
    hideAllForms();
    showAlert('설정이 저장되었습니다.');
}

// 아이 삭제
function deleteChild(id) {
    showConfirm('정말로 삭제하시겠습니까?', function(confirmed) {
        if (confirmed) {
            childrenData = childrenData.filter(child => child.id !== id);
            saveData();
            renderManageList();
            showAlert('삭제되었습니다.');
        }
    });
}

// 아이 수정 (간단한 구현)
function editChild(id) {
    const child = childrenData.find(c => c.id === id);
    if (!child) return;
    
    const newName = prompt('이름:', child.name);
    if (newName === null) return;
    
    const newGoSchoolTime = prompt('등원 시간 (HH:MM):', child.goSchool.time);
    if (newGoSchoolTime === null) return;
    
    const newGoSchoolLocation = prompt('등원 장소:', child.goSchool.location);
    if (newGoSchoolLocation === null) return;
    
    const newGoHomeTime = prompt('하원 시간 (HH:MM):', child.goHome.time);
    if (newGoHomeTime === null) return;
    
    const newGoHomeLocation = prompt('하원 장소:', child.goHome.location);
    if (newGoHomeLocation === null) return;
    
    child.name = newName.trim();
    child.goSchool.time = newGoSchoolTime;
    child.goSchool.location = newGoSchoolLocation.trim();
    child.goHome.time = newGoHomeTime;
    child.goHome.location = newGoHomeLocation.trim();
    
    saveData();
    renderManageList();
    alert('수정되었습니다.');
}

// 모달 외부 클릭시 닫기
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal();
        }
    });
}
