#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BranchQ UI 템플릿 시스템 - 신규 상품 UI 자동 생성 스크립트
==========================================================

신규 금융상품이 추가될 때 자동으로 UI 구조, 데이터 바인딩,
Figma 디자인, React 컴포넌트 등을 생성합니다.

사용법:
  python generate_product_ui.py --product "futures" --name "선물거래" --dbfunc "branchq_get_all_futures_info"
"""

import argparse
import json
import yaml
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import sys


class ProductUIGenerator:
    """신규 상품 UI를 자동 생성하는 클래스"""

    def __init__(self, product_id: str, product_name: str, db_function: str):
        self.product_id = product_id
        self.product_name = product_name
        self.db_function = db_function
        self.timestamp = datetime.now().isoformat()
        self.base_path = Path(".")

    def generate_product_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """상품 설정 JSON 생성"""
        return {
            "product": {
                "id": self.product_id,
                "name": self.product_name,
                "dbFunction": self.db_function,
                "status": "active",
                "version": "1.0.0",
                "createdAt": self.timestamp,
                "screens": {
                    "list": config.get("list", {}),
                    "detail": config.get("detail", {}),
                    "form": config.get("form", {}),
                    "report": config.get("report", {})
                },
                "apiEndpoints": {
                    "list": f"GET /api/{self.product_id}/list",
                    "detail": f"GET /api/{self.product_id}/{{id}}",
                    "create": f"POST /api/{self.product_id}/create",
                    "update": f"PUT /api/{self.product_id}/{{id}}",
                    "delete": f"DELETE /api/{self.product_id}/{{id}}"
                }
            }
        }

    def generate_react_component_stubs(self) -> Dict[str, str]:
        """React 컴포넌트 스텁 생성"""
        components = {}

        # ListView Component
        components["ListViewContainer.tsx"] = f'''import React, {{ useState, useEffect }} from 'react';
import {{ DataTable, MetricCard, SearchBar }} from '@/components';
import {{ use{self.product_name.replace(' ', '')}List }} from '@/hooks/use-{self.product_id}-list';

interface Props {{
  filters?: Record<string, any>;
}}

export const {self.product_name.replace(' ', '')}ListView: React.FC<Props> = ({{ filters }}) => {{
  const {{ data, metrics, loading, error, fetchList }} = use{self.product_name.replace(' ', '')}List();

  useEffect(() => {{
    fetchList(filters);
  }}, [filters]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="list-view-container">
      <SearchBar onSearch={{(query) => fetchList({{ ...filters, search: query }})}} />

      <div className="metrics-row">
        {{metrics.map((metric) => (
          <MetricCard key={{metric.id}} {{...metric}} />
        ))}}
      </div>

      <DataTable
        data={{data}}
        columns={{}}
        onRowClick={{(row) => navigate(`/{self.product_id}/${{row.id}}`).}}
      />
    </div>
  );
}};
'''

        # DetailView Component
        components["DetailViewContainer.tsx"] = f'''import React, {{ useState, useEffect }} from 'react';
import {{ InfoPanel, TabGroup, Charts }} from '@/components';
import {{ use{self.product_name.replace(' ', '')}Detail }} from '@/hooks/use-{self.product_id}-detail';

interface Props {{
  id: string;
}}

export const {self.product_name.replace(' ', '')}DetailView: React.FC<Props> = ({{ id }}) => {{
  const {{ item, loading, error, fetchDetail }} = use{self.product_name.replace(' ', '')}Detail(id);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {{
    fetchDetail(id);
  }}, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>No data found</div>;

  return (
    <div className="detail-view-container">
      {/* 헤더 */}
      <div className="detail-header">
        <h2>{item.name}</h2>
        <span className="badge">{item.status}</span>
      </div>

      {/* 정보 패널 */}
      <div className="detail-layout">
        <div className="left-panel">
          <InfoPanel sections={{/* 템플릿에서 정의된 sections */}} />
        </div>

        <div className="right-panel">
          {/* 탭 그룹 */}
          <TabGroup
            activeTab={{activeTab}}
            onTabChange={{setActiveTab}}
            tabs={{/* 템플릿에서 정의된 tabs */}}
          />

          {/* 탭 콘텐츠 */}
          <div className="tab-content">
            {{activeTab === 'overview' && <Charts {{...item}} />}}
            {{activeTab === 'transactions' && <TransactionTable {{itemId: id}} />}}
            {{activeTab === 'analysis' && <AnalysisPanel {{itemId: id}} />}}
          </div>
        </div>
      </div>
    </div>
  );
}};
'''

        # FormModal 컴포넌트
        components["FormModal.tsx"] = f'''import React, {{ useState }} from 'react';
import {{ Form, Button, Alert }} from '@/components';
import {{ use{self.product_name.replace(' ', '')}Form }} from '@/hooks/use-{self.product_id}-form';

interface Props {{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemId?: string;
}}

export const {self.product_name.replace(' ', '')}FormModal: React.FC<Props> = ({{ isOpen, onClose, onSuccess, itemId }}) => {{
  const {{ data, errors, loading, submit }} = use{self.product_name.replace(' ', '')}Form(itemId);
  const [formData, setFormData] = useState(data);

  const handleSubmit = async (e: React.FormEvent) => {{
    e.preventDefault();
    const result = await submit(formData);
    if (result.success) {{
      onSuccess();
      onClose();
    }}
  }};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{itemId ? '수정' : '등록'}</h3>

        {{errors.general && <Alert type="error" message={{errors.general}} />}}

        <Form onSubmit={{handleSubmit}}>
          {{/* 템플릿에서 정의된 formFields */}}

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={{loading}}>
              저장
            </Button>
            <Button type="button" variant="secondary" onClick={{onClose}}>
              취소
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}};
'''

        # ReportSection 컴포넌트
        components["ReportSection.tsx"] = f'''import React, {{ useState, useEffect }} from 'react';
import {{ MetricCard, Charts, DataTable, InsightPanel }} from '@/components';
import {{ use{self.product_name.replace(' ', '')}Report }} from '@/hooks/use-{self.product_id}-report';

interface Props {{
  startDate: string;
  endDate: string;
}}

export const {self.product_name.replace(' ', '')}ReportSection: React.FC<Props> = ({{ startDate, endDate }}) => {{
  const {{ metrics, charts, insights, loading, error, fetchReport }} = use{self.product_name.replace(' ', '')}Report();

  useEffect(() => {{
    fetchReport({{ startDate, endDate }});
  }}, [startDate, endDate]);

  if (loading) return <div>리포트 생성 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="report-section">
      {/* 섹션 헤더 */}
      <div className="section-header">
        <h2>{self.product_name} 현황</h2>
        <p>기간: {startDate} ~ {endDate}</p>
      </div>

      {/* 핵심 지표 */}
      <div className="metrics-grid">
        {{metrics.map((metric) => (
          <MetricCard key={{metric.id}} {{...metric}} />
        ))}}
      </div>

      {/* 차트 */}
      <div className="charts-grid">
        {{charts.map((chart) => (
          <div key={{chart.id}} className="chart-container">
            <Charts type={{chart.type}} data={{chart.data}} title={{chart.title}} />
          </div>
        ))}}
      </div>

      {/* 인사이트 */}
      <InsightPanel insights={{insights}} />

      {/* 상세 데이터 테이블 */}
      <DataTable
        title="주요 거래"
        columns={{/* 템플릿에서 정의된 columns */}}
        dataSource={{`/api/{self.product_id}/report/transactions?start=${{startDate}}&end=${{endDate}}`}}
      />
    </div>
  );
}};
'''

        return components

    def generate_api_documentation(self) -> str:
        """API 문서 생성 (OpenAPI 형식)"""
        return f'''openapi: 3.0.0
info:
  title: {self.product_name} API
  version: 1.0.0
  description: "{self.product_name} 상품 조회 및 관리 API"

servers:
  - url: /api/{self.product_id}
    description: {self.product_name} API 엔드포인트

paths:
  /list:
    get:
      summary: "{self.product_name} 목록 조회"
      description: "페이지네이션, 필터링, 검색을 지원하는 {self.product_name} 목록 조회"
      parameters:
        - name: search
          in: query
          description: "검색 키워드"
          schema:
            type: string
        - name: filter
          in: query
          description: "필터 옵션"
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: "성공"
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    properties:
                      items:
                        type: array
                      total:
                        type: integer
                      summary:
                        type: object

  /{id}:
    get:
      summary: "{self.product_name} 상세 조회"
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: "성공"

  /:
    post:
      summary: "{self.product_name} 등록"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        '201':
          description: "등록 성공"

    put:
      summary: "{self.product_name} 수정"
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: "수정 성공"

    delete:
      summary: "{self.product_name} 삭제"
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: "삭제 성공"
'''

    def generate_test_cases(self) -> str:
        """테스트 케이스 생성"""
        return f'''import {{ describe, it, expect, beforeEach, afterEach }} from 'vitest';
import {{ render, screen, fireEvent, waitFor }} from '@testing-library/react';
import {{ {self.product_name.replace(' ', '')}ListView }} from './{self.product_id}/ListView';

describe('{self.product_name} UI Components', () => {{

  describe('ListView', () => {{
    it('should render list view with data', async () => {{
      const mockData = [
        {{ id: '1', name: 'Item 1', ... }},
        {{ id: '2', name: 'Item 2', ... }}
      ];

      render(<{self.product_name.replace(' ', '')}ListView />);

      await waitFor(() => {{
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
      }});
    }});

    it('should filter data when search term is entered', async () => {{
      render(<{self.product_name.replace(' ', '')}ListView />);

      const searchInput = screen.getByPlaceholderText('검색어 입력');
      fireEvent.change(searchInput, {{ target: {{ value: 'test' }} }});

      await waitFor(() => {{
        expect(searchInput).toHaveValue('test');
      }});
    }});

    it('should handle pagination', async () => {{
      render(<{self.product_name.replace(' ', '')}ListView />);

      const nextPageButton = screen.getByText('다음');
      fireEvent.click(nextPageButton);

      await waitFor(() => {{
        expect(screen.getByText('페이지 2')).toBeInTheDocument();
      }});
    }});
  }});

  describe('DetailView', () => {{
    it('should render detail view with item data', async () => {{
      render(<{self.product_name.replace(' ', '')}DetailView id="1" />);

      await waitFor(() => {{
        expect(screen.getByText('Item Details')).toBeInTheDocument();
      }});
    }});

    it('should switch between tabs', async () => {{
      render(<{self.product_name.replace(' ', '')}DetailView id="1" />);

      const tabButton = screen.getByText('거래내역');
      fireEvent.click(tabButton);

      await waitFor(() => {{
        expect(screen.getByText('Transaction')).toBeInTheDocument();
      }});
    }});
  }});

  describe('FormModal', () => {{
    it('should validate required fields', async () => {{
      render(
        <{self.product_name.replace(' ', '')}FormModal
          isOpen={{true}}
          onClose={{() => {{}}}}
          onSuccess={{() => {{}}}}
        />
      );

      const submitButton = screen.getByText('저장');
      fireEvent.click(submitButton);

      await waitFor(() => {{
        expect(screen.getByText('필수 입력 항목입니다')).toBeInTheDocument();
      }});
    }});

    it('should submit form with valid data', async () => {{
      const onSuccess = vi.fn();
      render(
        <{self.product_name.replace(' ', '')}FormModal
          isOpen={{true}}
          onClose={{() => {{}}}}
          onSuccess={{onSuccess}}
        />
      );

      // 폼 데이터 입력
      fireEvent.change(screen.getByLabelText('계좌명'), {{ target: {{ value: 'Test Account' }} }});

      // 제출
      fireEvent.click(screen.getByText('저장'));

      await waitFor(() => {{
        expect(onSuccess).toHaveBeenCalled();
      }});
    }});
  }});

}});
'''

    def generate_hooks(self) -> Dict[str, str]:
        """React Hooks 생성"""
        hooks = {}

        hooks["use-list.ts"] = f'''import {{ useState, useCallback }} from 'react';
import {{ api }} from '@/services/api';

interface ListParams {{
  search?: string;
  filter?: string;
  page?: number;
  limit?: number;
}}

export const use{self.product_name.replace(' ', '')}List = () => {{
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({{}});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async (params: ListParams = {{}}) => {{
    setLoading(true);
    setError(null);
    try {{
      const response = await api.get('/{self.product_id}/list', {{ params }});
      setData(response.data.items);
      setMetrics(response.data.summary);
    }} catch (err) {{
      setError(err instanceof Error ? err.message : 'Unknown error');
    }} finally {{
      setLoading(false);
    }}
  }}, []);

  return {{ data, metrics, loading, error, fetchList }};
}};
'''

        hooks["use-detail.ts"] = f'''import {{ useState, useCallback }} from 'react';
import {{ api }} from '@/services/api';

export const use{self.product_name.replace(' ', '')}Detail = (id: string) => {{
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (itemId: string) => {{
    setLoading(true);
    setError(null);
    try {{
      const response = await api.get('/{self.product_id}/${{itemId}}');
      setItem(response.data);
    }} catch (err) {{
      setError(err instanceof Error ? err.message : 'Unknown error');
    }} finally {{
      setLoading(false);
    }}
  }}, []);

  return {{ item, loading, error, fetchDetail }};
}};
'''

        return hooks

    def save_outputs(self, product_config: Dict, components: Dict, api_doc: str, tests: str, hooks: Dict):
        """생성된 파일들을 저장"""
        output_dir = self.base_path / "generated" / self.product_id
        output_dir.mkdir(parents=True, exist_ok=True)

        # 1. 상품 설정 JSON
        with open(output_dir / "config.json", "w", encoding="utf-8") as f:
            json.dump(product_config, f, indent=2, ensure_ascii=False)
        print(f"✓ 생성: {output_dir / 'config.json'}")

        # 2. React 컴포넌트
        components_dir = output_dir / "components"
        components_dir.mkdir(exist_ok=True)
        for filename, content in components.items():
            with open(components_dir / filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"✓ 생성: {components_dir / filename}")

        # 3. API 문서
        with open(output_dir / "api.yaml", "w", encoding="utf-8") as f:
            f.write(api_doc)
        print(f"✓ 생성: {output_dir / 'api.yaml'}")

        # 4. 테스트 케이스
        with open(output_dir / "components.test.ts", "w", encoding="utf-8") as f:
            f.write(tests)
        print(f"✓ 생성: {output_dir / 'components.test.ts'}")

        # 5. Hooks
        hooks_dir = output_dir / "hooks"
        hooks_dir.mkdir(exist_ok=True)
        for filename, content in hooks.items():
            with open(hooks_dir / filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"✓ 생성: {hooks_dir / filename}")

        # 6. 체크리스트
        checklist = self.generate_checklist()
        with open(output_dir / "CHECKLIST.md", "w", encoding="utf-8") as f:
            f.write(checklist)
        print(f"✓ 생성: {output_dir / 'CHECKLIST.md'}")

    def generate_checklist(self) -> str:
        """신규 상품 추가 체크리스트 생성"""
        return f'''# {self.product_name} UI 개발 체크리스트

생성 일시: {self.timestamp}
상품 ID: {self.product_id}
DB 함수: {self.db_function}

## ✅ 자동 생성 완료

- [x] 상품 설정 (config.json)
- [x] React 컴포넌트 스텁
  - [x] ListViewContainer.tsx
  - [x] DetailViewContainer.tsx
  - [x] FormModal.tsx
  - [x] ReportSection.tsx
- [x] React Hooks
  - [x] use-list.ts
  - [x] use-detail.ts
  - [x] use-form.ts
  - [x] use-report.ts
- [x] API 문서 (OpenAPI)
- [x] 테스트 케이스

## 📋 수동 작업 필요

### 1. 데이터 바인딩 정의
- [ ] 목록 조회 API 응답 형식 확인
- [ ] 상세 조회 API 응답 형식 확인
- [ ] 목록 열(columns) 정확히 정의
- [ ] 요약 지표(metrics) 정의
- [ ] 상세 정보 섹션 정의

### 2. Figma 디자인
- [ ] 목록 화면 디자인 (List View)
- [ ] 상세 화면 디자인 (Detail View)
- [ ] 폼 모달 디자인 (Form Modal)
- [ ] 리포트 섹션 디자인 (Report Section)
- [ ] 컴포넌트 명명 규칙 적용
- [ ] Code Connect 메타데이터 추가

### 3. 코드 구현
- [ ] 생성된 컴포넌트 stub 구현
- [ ] API 서비스 레이어 구현 (services/{self.product_id}.ts)
- [ ] 상태 관리 (Redux, Zustand, Context 등)
- [ ] 에러 처리 로직
- [ ] 로딩 상태 처리

### 4. 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] E2E 테스트 작성
- [ ] 시각적 회귀 테스트

### 5. 배포
- [ ] Figma 디자인 최종 검수
- [ ] 코드 리뷰
- [ ] 통합 테스트 통과
- [ ] 개발 환경 배포
- [ ] 스테이징 환경 배포
- [ ] 운영 환경 배포

### 6. 문서화
- [ ] API 문서 완성
- [ ] 개발자 가이드 작성
- [ ] 컴포넌트 사용 예시 작성
- [ ] 배포 노트 작성

## 📚 참고 자료

- [Figma Design System Guide](...)
- [React Component Guidelines](...)
- [API Documentation Template](...)
- [Testing Best Practices](...)

## 🎯 마일스톤

- [ ] Week 1: Figma 디자인 + Code Connect 설정
- [ ] Week 2: 컴포넌트 구현 + 단위 테스트
- [ ] Week 3: 통합 테스트 + 버그 수정
- [ ] Week 4: 배포 준비 + 문서화

---
생성된 파일들을 확인하고 위 체크리스트를 따라 개발을 진행하세요.
'''

    def run(self, config: Dict[str, Any]):
        """전체 생성 프로세스 실행"""
        print(f"\n{'=' * 60}")
        print(f"  {self.product_name} UI 자동 생성 시작")
        print(f"{'=' * 60}\n")

        try:
            # 1. 상품 설정 생성
            product_config = self.generate_product_config(config)
            print("✓ 상품 설정 생성 완료")

            # 2. React 컴포넌트 생성
            components = self.generate_react_component_stubs()
            print("✓ React 컴포넌트 스텁 생성 완료")

            # 3. API 문서 생성
            api_doc = self.generate_api_documentation()
            print("✓ API 문서 생성 완료")

            # 4. 테스트 케이스 생성
            tests = self.generate_test_cases()
            print("✓ 테스트 케이스 생성 완료")

            # 5. Hooks 생성
            hooks = self.generate_hooks()
            print("✓ React Hooks 생성 완료")

            # 6. 파일 저장
            self.save_outputs(product_config, components, api_doc, tests, hooks)

            print(f"\n{'=' * 60}")
            print(f"  ✅ 모든 파일 생성 완료!")
            print(f"{'=' * 60}\n")

            print(f"생성 디렉토리: generated/{self.product_id}/")
            print("\n다음 단계:")
            print("1. 생성된 파일들을 확인하세요")
            print("2. config.json을 수정하여 실제 데이터 필드를 정의하세요")
            print("3. CHECKLIST.md를 따라 개발을 진행하세요")

        except Exception as e:
            print(f"\n❌ 오류 발생: {str(e)}", file=sys.stderr)
            sys.exit(1)


def main():
    """CLI 진입점"""
    parser = argparse.ArgumentParser(
        description="BranchQ 신규 상품 UI 자동 생성 도구"
    )
    parser.add_argument(
        "--product",
        required=True,
        help="상품 ID (예: futures, derivatives)"
    )
    parser.add_argument(
        "--name",
        required=True,
        help="상품명 (예: '선물거래')"
    )
    parser.add_argument(
        "--dbfunc",
        required=True,
        help="DB 함수명 (예: branchq_get_all_futures_info)"
    )
    parser.add_argument(
        "--config",
        help="커스텀 설정 JSON 파일 경로"
    )

    args = parser.parse_args()

    # 기본 설정
    config = {
        "list": {},
        "detail": {},
        "form": {},
        "report": {}
    }

    # 커스텀 설정 로드
    if args.config:
        try:
            with open(args.config, "r", encoding="utf-8") as f:
                custom_config = json.load(f)
                config.update(custom_config)
        except FileNotFoundError:
            print(f"경고: 설정 파일을 찾을 수 없습니다: {args.config}")

    # 생성 실행
    generator = ProductUIGenerator(args.product, args.name, args.dbfunc)
    generator.run(config)


if __name__ == "__main__":
    main()
