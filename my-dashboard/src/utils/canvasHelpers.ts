
// Canvas API 응답 타입 정의 (필요한 부분만)
interface CanvasItem {
    plannable_id: number;
    plannable: {
        title: string;
        due_at?: string;
    };
    plannable_date: string;
    context_name: string;
    plannable_type: string;
}

// 대시보드에서 사용할 Task 타입
export interface Task {
    id: number;
    course: string;
    title: string;
    date: string; // YYYY-MM-DD
    color: string;
    type: string;
}

// 과목별 색상 매핑 (Course ID 또는 이름을 기반으로 색상 지정)
// tailwindcss 색상 클래스 사용
const COURSE_COLORS: Record<string, string> = {
    'CS 441': 'bg-blue-500',
    'CS 410': 'bg-orange-500',
    'CS 444': 'bg-purple-500',
    'CS 421': 'bg-green-500',
    'AAS 100': 'bg-red-500', 
    'CS 412': 'bg-yellow-500',
    'DEFAULT': 'bg-gray-500'
};

/**
 * 긴 context_name에서 간결한 과목 코드를 추출합니다.
 * 예: "Spring 2026-CS 410-Text Information Systems..." -> "CS 410"
 */
function extractCourseCode(contextName: string): string {
    // "Spring 2026-" 뒤에 오는 "알파벳 + 숫자" 패턴을 찾습니다.
    // 예: "Spring 2026-AAS 100-..."
    const match = contextName.match(/Spring \d{4}-([A-Z]+ \d+)-/);
    if (match && match[1]) {
        return match[1];
    }
    
    // 패턴이 매칭되지 않으면 앞부분만 일부 잘라서 반환하거나 전체 반환
    return contextName.split('-')[1] || contextName;
}

/**
 * 과목명에 맞는 색상을 반환합니다.
 */
function getCourseColor(courseCode: string): string {
    return COURSE_COLORS[courseCode] || COURSE_COLORS['DEFAULT'];
}

/**
 * 문자열 날짜를 "YYYY-MM-DD" 형태로 변환합니다.
 */
function formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (e) {
        console.error("Date parsing error", e);
        return dateString;
    }
}

/**
 * Canvas Raw Data를 Dashboard Task 형태로 변환합니다.
 */
export function transformCanvasData(data: any[]): Task[] {
    return data.map(item => {
        const courseCode = extractCourseCode(item.context_name);
        
        return {
            id: item.plannable_id,
            course: courseCode,
            title: item.plannable.title,
            date: formatDate(item.plannable_date),
            color: getCourseColor(courseCode),
            type: item.plannable_type
        };
    });
}
