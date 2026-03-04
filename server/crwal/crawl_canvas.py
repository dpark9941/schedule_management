import requests
import json
from datetime import datetime

# --- 설정 (Settings) ---
# UIUC Canvas URL
CANVAS_URL = "https://canvas.illinois.edu"
# ❗여기에 본인의 토큰을 넣으세요 (Bearer ...)
API_TOKEN = "YOUR_CANVAS_ACCESS_TOKEN_HERE" 
cookies = {
    "canvas_session": "YOUR_CANVAS_SESSION_COOKIE_HERE"
}
headers = {
    "Authorization": f"Bearer {API_TOKEN}"
}

def get_canvas_calendar_events():
    """
    Canvas 캘린더에 표시되는 모든 이벤트(과제, 시험, 일정)를 가져옵니다.
    """
    endpoint = f"{CANVAS_URL}/api/v1/planner/items" # 캘린더 아이템을 가져오는 엔드포인트
    
    # 파라미터 설정
    params = {
        "filter": "new_activity", # 과제 정보 위주로 (event로 바꾸면 일반 일정도 포함)
        "start_date": "2026-01-01", # 이번 학기 시작일
        "end_date": "2026-05-30",   # 이번 학기 종료일
        "per_page": 50,             # 한 번에 가져올 개수
        # "all_events": True,         # 모든 이벤트 포함
        # 필요한 상세 정보를 추가로 요청 (중요!)
        # "include[]": ["submission", "course", "assignment"] 
    }

    try:
        # response = requests.get(endpoint, headers=headers, params=params)
        response = requests.get(endpoint, cookies=cookies, params=params) # 토큰 대신 쿠키로 인증 (세션 유지)
        response.raise_for_status()
        events = response.json()
        
        # 보기 좋게 정제 (Normalization)
        cleaned_data = []
        
        for event in events:
            # Canvas 데이터 구조 뜯어보기
            # event['assignment'] 안에 과제에 대한 핵심 정보가 들어있음
            assignment_details = event.get('assignment', {})
            
            item = {
                # 1. 식별자
                "id": event.get('id'),
                "title": event.get('title'), # 예: "MP1: Linear Filters"
                
                # 2. 날짜 정보 (가장 중요)
                "start_at": event.get('start_at'), # 시작 시간 (UTC)
                "end_at": event.get('end_at'),     # 마감 시간 (UTC)
                
                # 3. 수업 정보
                "course_id": assignment_details.get('course_id'),
                "context_name": event.get('context_name'), # 예: "CS 441: Computer Vision"
                
                # 4. 과제 세부 속성 (우리가 DB에 저장해야 할 핵심)
                "points_possible": assignment_details.get('points_possible'), # 배점 (우선순위 계산용)
                "submission_types": assignment_details.get('submission_types'), # 제출 방식 (online_upload 등)
                "html_url": event.get('html_url'), # Canvas 해당 과제 페이지 링크
                
                # 5. 내 상태 (제출 했는지 여부)
                "has_submitted": assignment_details.get('has_submitted_submissions', False),
                "score": assignment_details.get('submission', {}).get('score') # 이미 채점됐다면 점수
            }
            cleaned_data.append(item)
            
        return cleaned_data

    except Exception as e:
        print(f"❌ Error fetching Canvas data: {e}")
        return []

# --- 실행 및 출력 ---
if __name__ == "__main__":
    print("Fetching Canvas Calendar Data...")
    data = get_canvas_calendar_events()
    
    # 결과를 JSON 파일로 저장해서 천천히 뜯어보세요
    with open('canvas_schema_sample.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ {len(data)}개의 일정을 가져와서 'canvas_schema_sample.json'에 저장했습니다.")
    
    # 샘플 하나만 터미널에 출력
    if data:
        print("\n[Sample Data Structure]")
        print(json.dumps(data[0], indent=2))