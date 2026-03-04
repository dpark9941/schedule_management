document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = "연결 중...";

    // 현재 활성화된 탭 가져오기
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 캔버스 사이트인지 확인
    if (!tab.url.includes("canvas.illinois.edu")) {
        statusDiv.textContent = "Canvas 사이트에서 실행해주세요!";
        statusDiv.style.color = "red";
        return;
    }

    statusDiv.textContent = "데이터 수집 시작...";

    try {
        // content script에 메시지 전송
        const response = await chrome.tabs.sendMessage(tab.id, { action: "scrape_canvas" });
        
        if (response && response.success) {
            statusDiv.textContent = `성공! ${response.count}개 항목 다운로드됨.`;
            statusDiv.style.color = "green";
        } else {
            statusDiv.textContent = "데이터를 찾지 못했습니다.";
            statusDiv.style.color = "orange";
        }
    } catch (error) {
        console.error(error);
        statusDiv.textContent = "오류 발생: 페이지를 새로고침 해주세요.";
        statusDiv.style.color = "red";
    }
});
