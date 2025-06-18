// 전역 변수
let children = [];

// 출발 시간 저장 (메모리)
let departureTimes = {
    pickup: '08:30',
    dropoff: '14:30'
};

let isEditing = false;
let editingId = null;
let confirmCallback = null;

// 로컬스토리지에서 데이터 불러오기
function loadData() {
    // 아이 데이터 불러오기
    const savedChildren = localStorage.getItem('summerhill_children');
    if (savedChildren) {
        children = JSON.parse(savedChildren);
    } else {
        // 초기 데이터 (최초 실행시에만)
        children = [
            { id: 1, name: '김상수', pickupTime: '08:30', dropoffTime: '08:30', pickupLocation: '아파트', dropoffLocation: '아파트' },
            { id: 2, name: '박지우', pickupTime: '08:35', dropoffTime: '08:35', pickupLocation: '202동', dropoffLocation: '202동' },
            { id: 3, name: '김태한', pickupTime: '08:40', dropoffTime: '08:40', pickupLocation: '302', dropoffLocation: '302' },
            { id: 4, name: '송소영', pickupTime: '08:47', dropoffTime: '08:47', pickupLocation: '놀이터', dropoffLocation: '놀이터' },
            { id: 5, name: '김동원', pickupTime: '08:50', dropoffTime: '08:50', pickupLocation: '101', dropoffLocation: '101' },
            { id: 6, name: '강창희', pickupTime: '08:55', dropoffTime: '08:55', pickupLocation: '102', dropoffLocation: '102' },
            { id: 7, name: '김준우', pickupTime: '08:57', dropoffTime: '08:57', pickupLocation: '우체국', dropoffLocation: '우체국' },
            { id: 8, name: '장상현', pickupTime: '08:59', dropoffTime: '08:59', pickupLocation: '아파트', dropoffLocation: '아파트' },
            { id: 9, name: '김일우', pickupTime: '08:59', dropoffTime: '08:59', pickupLocation: '402', dropoffLocation: '402' },
            { id: 10, name: '김한범', pickupTime: '09:00', dropoffTime: '09:00', pickupLocation: '사거리', dropoffLocation: '사거리' }
        ];
        saveChildren();
    }
    
    // 출발시간 불러오기
    const savedDepartureTimes = localStorage.getItem('summerhill_departure_times');
    if (savedDepartureTimes) {
        departureTimes = JSON.parse(savedDepartureTimes);
    }
}

// 아이 데이터를 로컬스토리지에 저장
function saveChildren() {
    localStorage.setItem('summerhill_children', JSON.stringify(children));
}

// 출발시간을 로컬스토리지에 저장
function saveDepartureTimes() {
    localStorage.setItem('summerhill_departure_times', JSON.stringify(departureTimes));
}

// 커스텀 알림창 함수
function showCustomAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').classList.add('show');
}

function closeCustomAlert() {
    document.getElementById('customAlert').classList.remove('show');
}

// 커스텀 확인창 함수
function showCustomConfirm(message, callback) {
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = callback;
    document.getElementById('customConfirm').classList.add('show');
}

function closeCustomConfirm(result) {
    document.getElementById('customConfirm').classList.remove('show');
    if (confirmCallback) {
        confirmCallback(result);
        confirmCallback = null;
    }
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 저장된 데이터 불러오기
    loadData();
    
    // 이벤트 리스너 등록
    setupEventListeners();
    
    // 초기 데이터 렌더링
    renderChildrenList();
    updateDepartureDisplays();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    document.getElementById('pickupBtn').addEventListener('click', (e) => {
        addButtonFeedback(e);
        setTimeout(() => {
            renderSchedule('pickup');
            showScreen('pickupScreen');
        }, 100);
    });
    
    document.getElementById('dropoffBtn').addEventListener('click', (e) => {
        addButtonFeedback(e);
        setTimeout(() => {
            renderSchedule('dropoff');
            showScreen('dropoffScreen');
        }, 100);
    });
    
    document.getElementById('manageBtn').addEventListener('click', (e) => {
        addButtonFeedback(e);
        setTimeout(() => {
            renderChildrenList();
            showScreen('manageScreen');
        }, 100);
    });
    
    document.getElementById('addChildBtn').addEventListener('click', (e) => {
        addButtonFeedback(e);
        setTimeout(() => {
            resetForm();
            showScreen('addChildScreen');
        }, 100);
    });
    
    // 모든 버튼에 터치 피드백 추가
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('main-btn')) {
            addButtonFeedback(e);
        }
    });
}

// 출발 시간 표시 업데이트
function updateDepartureDisplays() {
    const pickupDisplay = document.getElementById('pickupDepartureDisplay');
    const dropoffDisplay = document.getElementById('dropoffDepartureDisplay');
    
    if (pickupDisplay) {
        pickupDisplay.textContent = `출발 ${departureTimes.pickup}`;
    }
    if (dropoffDisplay) {
        dropoffDisplay.textContent = `출발 ${departureTimes.dropoff}`;
    }
}

// 출발 시간 업데이트
function updateDepartureTime(type) {
    const inputId = type === 'pickup' ? 'pickupDepartureInput' : 'dropoffDepartureInput';
    const inputElement = document.getElementById(inputId);
    const newTime = inputElement.value;
    
    if (newTime) {
        departureTimes[type] = newTime;
        saveDepartureTimes(); // 저장
        updateDepartureDisplays();
        showCustomAlert(`${type === 'pickup' ? '등원' : '하원'} 출발시간이 ${newTime}로 변경되었습니다.`);
    }
}

// 화면 전환 (애니메이션 추가)
function showScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(screenId);
    
    // 현재 화면 페이드 아웃
    if (currentScreen) {
        currentScreen.classList.add('slide-out');
        setTimeout(() => {
            currentScreen.classList.remove('active', 'slide-out');
        }, 300);
    }
    
    // 새 화면 페이드 인
    setTimeout(() => {
        targetScreen.classList.add('active');
        targetScreen.classList.add('page-enter');
        setTimeout(() => {
            targetScreen.classList.remove('page-enter');
        }, 300);
    }, 150);
}

// 버튼 터치 피드백 추가
function addButtonFeedback(event) {
    const button = event.target;
    button.classList.add('btn-feedback');
    setTimeout(() => {
        button.classList.remove('btn-feedback');
    }, 150);
}

// 시간표 렌더링
function renderSchedule(type) {
    const listId = type === 'pickup' ? 'pickupList' : 'dropoffList';
    const timeKey = type === 'pickup' ? 'pickupTime' : 'dropoffTime';
    const locationKey = type === 'pickup' ? 'pickupLocation' : 'dropoffLocation';
    
    // 시간순으로 정렬
    const sortedChildren = [...children].sort((a, b) => a[timeKey].localeCompare(b[timeKey]));
    
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '';
    
    sortedChildren.forEach(child => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'schedule-item';
        itemDiv.innerHTML = `
            <span class="name">${child.name}</span> ${child[timeKey]} <span class="name">${child[locationKey]}</span>
        `;
        listElement.appendChild(itemDiv);
    });
}

// 아이 목록 렌더링
function renderChildrenList() {
    const listElement = document.getElementById('childrenList');
    listElement.innerHTML = '';
    
    children.forEach(child => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'child-item';
        itemDiv.innerHTML = `
            <div class="child-name">${child.name}</div>
            <div class="child-buttons">
                <button class="edit-btn" onclick="editChild(${child.id})">수정</button>
                <button class="delete-btn" onclick="deleteChild(${child.id})">삭제</button>
            </div>
        `;
        listElement.appendChild(itemDiv);
    });
    
    // 출발 시간 입력 필드 초기화
    const pickupInput = document.getElementById('pickupDepartureInput');
    const dropoffInput = document.getElementById('dropoffDepartureInput');
    if (pickupInput) pickupInput.value = departureTimes.pickup;
    if (dropoffInput) dropoffInput.value = departureTimes.dropoff;
}

// 아이 편집
function editChild(id) {
    const child = children.find(c => c.id === id);
    if (child) {
        isEditing = true;
        editingId = id;
        
        // 폼에 데이터 채우기
        document.getElementById('childName').value = child.name;
        document.getElementById('pickupTime').value = child.pickupTime;
        document.getElementById('pickupLocation').value = child.pickupLocation;
        document.getElementById('dropoffTime').value = child.dropoffTime;
        document.getElementById('dropoffLocation').value = child.dropoffLocation;
        
        // 제목 변경
        document.getElementById('formTitle').textContent = '아이 수정';
        document.getElementById('saveBtn').textContent = '수정';
        
        showScreen('addChildScreen');
    }
}

// 아이 삭제
function deleteChild(id) {
    showCustomConfirm('정말로 삭제하시겠습니까?', function(result) {
        if (result) {
            children = children.filter(child => child.id !== id);
            saveChildren(); // 저장
            renderChildrenList();
        }
    });
}

// 폼 리셋
function resetForm() {
    isEditing = false;
    editingId = null;
    
    document.getElementById('childName').value = '';
    document.getElementById('pickupTime').value = '';
    document.getElementById('pickupLocation').value = '';
    document.getElementById('dropoffTime').value = '';
    document.getElementById('dropoffLocation').value = '';
    
    document.getElementById('formTitle').textContent = '아이 추가';
    document.getElementById('saveBtn').textContent = '저장';
}

// 폼 취소
function cancelForm() {
    resetForm();
    showScreen('manageScreen');
}

// 아이 저장
function saveChild() {
    const name = document.getElementById('childName').value.trim();
    const pickupTime = document.getElementById('pickupTime').value;
    const pickupLocation = document.getElementById('pickupLocation').value.trim();
    const dropoffTime = document.getElementById('dropoffTime').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value.trim();
    
    // 유효성 검사
    if (!name) {
        showCustomAlert('이름을 입력해주세요.');
        return;
    }
    
    if (!pickupTime) {
        showCustomAlert('등원 시간을 선택해주세요.');
        return;
    }
    
    if (!pickupLocation) {
        showCustomAlert('등원 장소를 입력해주세요.');
        return;
    }
    
    if (!dropoffTime) {
        showCustomAlert('하원 시간을 선택해주세요.');
        return;
    }
    
    if (!dropoffLocation) {
        showCustomAlert('하원 장소를 입력해주세요.');
        return;
    }
    
    if (isEditing) {
        // 수정
        const childIndex = children.findIndex(c => c.id === editingId);
        if (childIndex !== -1) {
            children[childIndex] = {
                ...children[childIndex],
                name,
                pickupTime,
                pickupLocation,
                dropoffTime,
                dropoffLocation
            };
        }
        saveChildren(); // 저장
        showCustomAlert('아이 정보가 수정되었습니다.');
    } else {
        // 새로 추가
        const newChild = {
            id: Date.now(),
            name,
            pickupTime,
            pickupLocation,
            dropoffTime,
            dropoffLocation
        };
        children.push(newChild);
        saveChildren(); // 저장
        showCustomAlert('새 아이가 추가되었습니다.');
    }
    
    // 폼 리셋하고 관리 화면으로 이동
    resetForm();
    renderChildrenList();
    showScreen('manageScreen');
}

// 서비스 워커 등록 (PWA 기능)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
