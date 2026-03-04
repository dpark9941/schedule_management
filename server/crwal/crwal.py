import requests
from bs4 import BeautifulSoup
import dateparser
from datetime import datetime
import re

# 타겟 사이트 (CS 444 Spring 2026)
URL = "https://slazebni.cs.illinois.edu/spring26/"

def fetch_assignments():
    try:
        response = requests.get(URL)
        response.raise_for_status() # 404, 500 에러 체크
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 결과 저장용 리스트
        tasks = []

        # 1. 테이블 찾기: 보통 'Schedule' 섹션 아래에 있는 테이블
        # (이 사이트는 테이블이 하나밖에 없어서 간단하지만, 확실히 하기 위해 table 태그를 찾음)
        table = soup.find('table')
        if not table:
            print("❌ 테이블을 찾을 수 없습니다.")
            return

        # 2. 행(Row) 순회
        rows = table.find_all('tr')
        
        # 현재 연도 (2026)
        current_year = 2026

        for row in rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) < 3: continue # 데이터가 부족한 행은 패스

            # 텍스트 추출 (앞뒤 공백 제거)
            date_text = cells[0].get_text(strip=True)
            topic_text = cells[1].get_text(strip=True)
            assignment_text = cells[2].get_text(strip=True)
            
            # 3. 과제(Assignment) 필터링 로직
            # "MP", "Quiz", "Project" 같은 키워드가 있거나, 링크가 있는 경우만 추출
            if not assignment_text: continue
            
            # "No class" 같은 건 제외
            if "No class" in topic_text: continue

            # 링크 추출 (과제 제출 링크나 명세서)
            link = None
            a_tag = cells[2].find('a')
            if a_tag and 'href' in a_tag.attrs:
                link = a_tag['href']
                # 상대 경로(../)나 절대 경로 처리
                if not link.startswith('http'):
                    link = URL + link

            # 4. 날짜 파싱 (핵심!)
            # "Jan 21", "Feb 13" 같은 텍스트를 실제 날짜 객체로 변환
            # dateparser는 '2주 뒤', '내일' 같은 자연어도 인식하는 강력한 라이브러리
            parsed_date = dateparser.parse(date_text)
            
            if parsed_date:
                # 연도 보정 (사이트에 연도가 없을 경우)
                parsed_date = parsed_date.replace(year=current_year)
                formatted_date = parsed_date.strftime('%Y-%m-%d')
            else:
                formatted_date = None # 날짜 파싱 실패 (예: "TBA")

            # 5. 데이터 구조화 (JSON 스타일)
            task = {
                "course_id": "CS444",
                "title": assignment_text, # "MP1 released" 같은 텍스트
                "type": classify_task_type(assignment_text), # MP, Quiz 분류
                "raw_date": date_text,    # 원본 날짜 텍스트 (DB 저장 권장)
                "due_date": formatted_date, # 파싱된 날짜
                "link": link,
                "is_completed": False
            }
            
            # "due"나 "Quiz" 같은 중요한 일정만 리스트에 추가
            if task['type'] != 'Lecture':
                tasks.append(task)

        return tasks

    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        return []

def classify_task_type(text):
    """과제 텍스트를 보고 타입을 분류하는 헬퍼 함수"""
    text_lower = text.lower()
    if 'mp' in text_lower: return 'Assignment' # Machine Problem
    if 'quiz' in text_lower: return 'Quiz'
    if 'project' in text_lower: return 'Project'
    if 'exam' in text_lower or 'midterm' in text_lower: return 'Exam'
    if 'due' in text_lower: return 'Deadline'
    return 'Lecture' # 기본값

# --- 실행 및 출력 ---
if __name__ == "__main__":
    print(f"🔍 Searching {URL} for tasks...\n")
    results = fetch_assignments()
    
    # 결과 예쁘게 출력
    import json
    print(json.dumps(results, indent=2, ensure_ascii=False))
    
    print(f"\n✅ 총 {len(results)}개의 일정을 찾았습니다.")