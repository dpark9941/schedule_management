// popup.js로부터 메시지를 기다림
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape_canvas") {
        console.log("GraingerHub: 데이터 수집 시작...");
        
        fetchPlannerItems()
            .then(data => {
                if (data && data.length > 0) {
                    downloadJSON(data, 'canvas_spring_2026.json');
                    sendResponse({ success: true, count: data.length });
                } else {
                    console.warn("GraingerHub: 데이터가 없습니다.");
                    sendResponse({ success: false, count: 0 });
                }
            })
            .catch(err => {
                console.error("GraingerHub Error:", err);
                sendResponse({ success: false, error: err.message });
            });
        
        // 비동기 응답(sendResponse)을 위해 true 반환 필수
        return true; 
    }
});

async function fetchPlannerItems() {
    // 사용자가 요청한 날짜 범위: 2026년 1학기
    const startDate = "2026-01-01";
    const endDate = "2026-05-20";
    const endpoint = `/api/v1/planner/items?start_date=${startDate}&end_date=${endDate}&per_page=100`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(`GraingerHub: ${data.length}개 아이템 수신 완료.`);
        return data;
    } catch (error) {
        console.error("Fetch 실패:", error);
        throw error;
    }
}

function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    a.click();
    
    // 정리
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}
