#!/usr/bin/env python3
"""
Executor Web API Server
REST API를 통해 웹 브라우저에서 Executor 명령어 실행

Usage:
  python executor_api.py --port 5000

접속:
  http://localhost:5000
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Any

# Flask 라이브러리 확인
try:
    from flask import Flask, jsonify, request, render_template_string
    from flask_cors import CORS
except ImportError:
    print("[FAIL] Flask가 필요합니다.")
    print("설치: pip install flask flask-cors")
    sys.exit(1)

# Executor 임포트
sys.path.insert(0, str(Path(__file__).parent))
from executor import UIExecutor


app = Flask(__name__)
CORS(app)

executor = UIExecutor()


# ========== HTML 템플릿 ==========

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Executor Web Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f5f5f5;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }

        .card h3 {
            margin-bottom: 15px;
            font-size: 16px;
            color: #333;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            font-size: 13px;
            margin-bottom: 5px;
            font-weight: 500;
            color: #666;
        }

        input, select, textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            width: 100%;
        }

        button:hover {
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        button.secondary {
            background: #6c757d;
            margin-top: 5px;
        }

        button.secondary:hover {
            background: #5a6268;
        }

        button.danger {
            background: #dc3545;
        }

        button.danger:hover {
            background: #c82333;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 5px;
        }

        .status-active {
            background: #d4edda;
            color: #155724;
        }

        .status-warning {
            background: #fff3cd;
            color: #856404;
        }

        .status-error {
            background: #f8d7da;
            color: #721c24;
        }

        .output {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin-top: 10px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .output.success {
            border-left: 3px solid #28a745;
            background: #f1f7f4;
        }

        .output.error {
            border-left: 3px solid #dc3545;
            background: #f7f1f1;
        }

        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .metric {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
        }

        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }

        .metric-label {
            font-size: 12px;
            color: #666;
        }

        .tab-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        .tab {
            padding: 12px 20px;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
        }

        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .loading {
            display: inline-block;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .alert {
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 13px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>[DEPLOY] Executor Web Dashboard</h1>
            <p>UI Template System 관리 및 배포 제어</p>
        </header>

        <div class="tab-container">
            <button class="tab active" onclick="switchTab('status')">[STATUS] 상태</button>
            <button class="tab" onclick="switchTab('product')">📦 상품</button>
            <button class="tab" onclick="switchTab('deploy')">[DEPLOY] 배포</button>
            <button class="tab" onclick="switchTab('metrics')">[METRIC] 메트릭</button>
            <button class="tab" onclick="switchTab('rollback')">[ROLLBACK] 롤백</button>
        </div>

        <!-- 상태 탭 -->
        <div id="status" class="tab-content active">
            <div class="grid">
                <div class="card">
                    <h3>[REFRESH] 시스템 상태</h3>
                    <button onclick="getStatus()">상태 조회</button>
                    <div id="status-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>[STATUS] 실시간 메트릭</h3>
                    <button onclick="getMetrics()">메트릭 수집</button>
                    <div id="metrics-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>[METRIC] 트렌드 분석</h3>
                    <div class="form-group">
                        <label>분석 기간</label>
                        <select id="trend-hours">
                            <option value="1">1시간</option>
                            <option value="24" selected>24시간</option>
                            <option value="168">1주일</option>
                        </select>
                    </div>
                    <button onclick="getTrend()">트렌드 분석</button>
                    <div id="trend-output" class="output"></div>
                </div>
            </div>
        </div>

        <!-- 상품 탭 -->
        <div id="product" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>📦 상품 목록</h3>
                    <button onclick="listProducts()">목록 조회</button>
                    <div id="product-list-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>➕ 새 상품 생성</h3>
                    <div class="form-group">
                        <label>상품명</label>
                        <input type="text" id="product-name" placeholder="예: 선물거래">
                    </div>
                    <div class="form-group">
                        <label>DB 함수명</label>
                        <input type="text" id="product-dbfunc" placeholder="예: branchq_get_all_futures_info">
                    </div>
                    <button onclick="createProduct()">상품 생성</button>
                    <div id="product-create-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>🔍 상품 정보</h3>
                    <div class="form-group">
                        <label>상품 ID</label>
                        <input type="text" id="product-id" placeholder="예: credit-card">
                    </div>
                    <button onclick="getProductInfo()">정보 조회</button>
                    <div id="product-info-output" class="output"></div>
                </div>
            </div>
        </div>

        <!-- 배포 탭 -->
        <div id="deploy" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>[DEPLOY] 배포 시작</h3>
                    <div class="form-group">
                        <label>상품 ID (선택)</label>
                        <input type="text" id="deploy-product" placeholder="생략하면 모든 상품">
                    </div>
                    <div class="form-group">
                        <label>버전</label>
                        <input type="text" id="deploy-version" placeholder="예: 1.0.0">
                    </div>
                    <div class="form-group">
                        <label>스테이지</label>
                        <select id="deploy-stage">
                            <option value="canary">Canary</option>
                            <option value="production">Production</option>
                        </select>
                    </div>
                    <button onclick="deployStart()">배포 시작</button>
                    <div id="deploy-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>[STATUS] 배포 상태</h3>
                    <button onclick="deployStatus()">상태 조회</button>
                    <div id="deploy-status-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>⏸️ 배포 제어</h3>
                    <div class="form-group">
                        <label>배포 ID</label>
                        <input type="text" id="deploy-id" placeholder="예: deploy-123456789">
                    </div>
                    <button onclick="deployPause()" class="secondary">일시 중지</button>
                    <button onclick="deployResume()" class="secondary">재개</button>
                    <div id="deploy-control-output" class="output"></div>
                </div>
            </div>
        </div>

        <!-- 메트릭 탭 -->
        <div id="metrics" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>[STATUS] 메트릭 수집</h3>
                    <div class="form-group">
                        <label>상품 (선택)</label>
                        <input type="text" id="metrics-product" placeholder="생략하면 모든 상품">
                    </div>
                    <button onclick="collectMetrics()">메트릭 수집</button>
                    <div id="collect-metrics-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>[METRIC] 메트릭 요약</h3>
                    <div id="metrics-summary" class="metrics"></div>
                </div>

                <div class="card">
                    <h3>🔍 메트릭 해석</h3>
                    <p style="font-size: 12px; line-height: 1.6;">
                        <strong>[OK] 정상:</strong><br>
                        • Error rate &lt; 0.1%<br>
                        • P95 Latency &lt; 250ms<br>
                        • Success rate &gt; 99.5%<br><br>

                        <strong>[WARN] 경고:</strong><br>
                        • Error rate 0.1-0.5%<br>
                        • P95 Latency 250-500ms<br>
                        • Success rate 99-99.5%<br><br>

                        <strong>🚨 긴급:</strong><br>
                        • Error rate &gt; 0.5%<br>
                        • P95 Latency &gt; 500ms<br>
                        • Success rate &lt; 99%
                    </p>
                </div>
            </div>
        </div>

        <!-- 롤백 탭 -->
        <div id="rollback" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>[ROLLBACK] 긴급 롤백</h3>
                    <div class="alert alert-error">
                        [WARN] 이 작업은 현재 배포를 중단하고 이전 버전으로 복구합니다.
                    </div>
                    <div class="form-group">
                        <label>롤백 대상 스테이지</label>
                        <select id="rollback-stage">
                            <option value="canary-25">Canary 25%</option>
                            <option value="canary-50">Canary 50%</option>
                            <option value="production-100">Production 100%</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>롤백 이유</label>
                        <select id="rollback-reason">
                            <option value="high error rate">에러율 증가</option>
                            <option value="high latency">높은 레이턴시</option>
                            <option value="low success rate">낮은 성공률</option>
                            <option value="critical bug discovered">심각한 버그 발견</option>
                            <option value="manual request">수동 요청</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>복구할 버전</label>
                        <input type="text" id="rollback-version" placeholder="예: 1.0.0">
                    </div>
                    <button onclick="executeRollback()" class="danger">롤백 실행</button>
                    <div id="rollback-output" class="output"></div>
                </div>

                <div class="card">
                    <h3>📋 롤백 가이드</h3>
                    <p style="font-size: 12px; line-height: 1.8;">
                        <strong>언제 롤백하나요?</strong><br>
                        • 에러율이 0.5% 초과<br>
                        • P95 레이턴시가 500ms 초과<br>
                        • 성공률이 99% 미만<br>
                        • 심각한 버그 발견<br><br>

                        <strong>롤백 후 확인 사항:</strong><br>
                        1. 메트릭 수집으로 복구 확인<br>
                        2. 문제 원인 분석<br>
                        3. 수정 후 재배포<br>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 탭 전환
        function switchTab(tabName) {
            // 모든 탭 숨기기
            document.querySelectorAll('.tab-content').forEach(el => {
                el.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(el => {
                el.classList.remove('active');
            });

            // 선택된 탭 보이기
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        // API 호출 헬퍼
        async function callAPI(endpoint, method = 'GET', data = null) {
            try {
                const options = {
                    method: method,
                    headers: { 'Content-Type': 'application/json' }
                };

                if (data) {
                    options.body = JSON.stringify(data);
                }

                const response = await fetch(`/api${endpoint}`, options);
                const result = await response.json();
                return result;
            } catch (error) {
                return { error: error.message };
            }
        }

        // 출력 함수
        function showOutput(elementId, data, isError = false) {
            const el = document.getElementById(elementId);
            el.textContent = JSON.stringify(data, null, 2);
            el.className = 'output ' + (isError ? 'error' : 'success');
        }

        // 상태 조회
        async function getStatus() {
            const result = await callAPI('/status');
            showOutput('status-output', result);

            // 메트릭 요약 표시
            if (result.metrics) {
                displayMetricsSummary(result.metrics);
            }
        }

        // 메트릭 표시
        function displayMetricsSummary(metrics) {
            const summary = metrics.summary || {};
            const html = `
                <div class="metric">
                    <div class="metric-value">${(summary.total_requests || 0).toLocaleString()}</div>
                    <div class="metric-label">총 요청</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${(summary.average_latency || 0).toFixed(0)}ms</div>
                    <div class="metric-label">평균 레이턴시</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${summary.critical_alerts || 0}</div>
                    <div class="metric-label">긴급 알림</div>
                </div>
            `;
            const el = document.getElementById('metrics-summary');
            if (el) el.innerHTML = html;
        }

        // 메트릭 수집
        async function getMetrics() {
            const result = await callAPI('/metrics');
            showOutput('metrics-output', result);
            displayMetricsSummary(result);
        }

        // 트렌드 분석
        async function getTrend() {
            const hours = document.getElementById('trend-hours').value;
            const result = await callAPI(`/metrics/trend?hours=${hours}`);
            showOutput('trend-output', result);
        }

        // 상품 목록
        async function listProducts() {
            const result = await callAPI('/products');
            showOutput('product-list-output', result);
        }

        // 상품 생성
        async function createProduct() {
            const name = document.getElementById('product-name').value;
            const dbfunc = document.getElementById('product-dbfunc').value;

            if (!name || !dbfunc) {
                alert('상품명과 DB 함수명을 입력하세요.');
                return;
            }

            const result = await callAPI('/products', 'POST', {
                name: name,
                dbfunc: dbfunc
            });

            showOutput('product-create-output', result);

            if (!result.error) {
                document.getElementById('product-name').value = '';
                document.getElementById('product-dbfunc').value = '';
            }
        }

        // 상품 정보
        async function getProductInfo() {
            const id = document.getElementById('product-id').value;
            if (!id) {
                alert('상품 ID를 입력하세요.');
                return;
            }

            const result = await callAPI(`/products/${id}`);
            showOutput('product-info-output', result);
        }

        // 배포 시작
        async function deployStart() {
            const product = document.getElementById('deploy-product').value || null;
            const version = document.getElementById('deploy-version').value;
            const stage = document.getElementById('deploy-stage').value;

            if (!version) {
                alert('버전을 입력하세요.');
                return;
            }

            const result = await callAPI('/deploy', 'POST', {
                product: product,
                version: version,
                stage: stage
            });

            showOutput('deploy-output', result);
        }

        // 배포 상태
        async function deployStatus() {
            const result = await callAPI('/deploy/status');
            showOutput('deploy-status-output', result);
        }

        // 배포 일시중지
        async function deployPause() {
            const id = document.getElementById('deploy-id').value;
            if (!id) {
                alert('배포 ID를 입력하세요.');
                return;
            }

            const result = await callAPI(`/deploy/${id}/pause`, 'POST');
            showOutput('deploy-control-output', result);
        }

        // 배포 재개
        async function deployResume() {
            const id = document.getElementById('deploy-id').value;
            if (!id) {
                alert('배포 ID를 입력하세요.');
                return;
            }

            const result = await callAPI(`/deploy/${id}/resume`, 'POST');
            showOutput('deploy-control-output', result);
        }

        // 메트릭 수집
        async function collectMetrics() {
            const product = document.getElementById('metrics-product').value || null;
            const result = await callAPI(`/metrics${product ? `?product=${product}` : ''}`);
            showOutput('collect-metrics-output', result);
            displayMetricsSummary(result);
        }

        // 롤백 실행
        async function executeRollback() {
            const stage = document.getElementById('rollback-stage').value;
            const reason = document.getElementById('rollback-reason').value;
            const version = document.getElementById('rollback-version').value;

            if (!version) {
                alert('복구할 버전을 입력하세요.');
                return;
            }

            if (!confirm(`정말 ${stage}을(를) ${version}(으)로 롤백하시겠습니까?`)) {
                return;
            }

            const result = await callAPI('/rollback', 'POST', {
                stage: stage,
                reason: reason,
                version: version
            });

            showOutput('rollback-output', result);

            if (!result.error) {
                document.getElementById('rollback-version').value = '';
            }
        }

        // 초기 로드
        window.onload = function() {
            getStatus();
        };
    </script>
</body>
</html>
"""


# ========== API 엔드포인트 ==========

@app.route('/')
def index():
    """메인 페이지"""
    return render_template_string(HTML_TEMPLATE)


@app.route('/api/status', methods=['GET'])
def api_status():
    """시스템 상태"""
    return jsonify(executor.status())


@app.route('/api/metrics', methods=['GET'])
def api_metrics():
    """메트릭 수집"""
    product = request.args.get('product')
    return jsonify(executor.metrics_collect(product))


@app.route('/api/metrics/trend', methods=['GET'])
def api_metrics_trend():
    """트렌드 분석"""
    hours = int(request.args.get('hours', 24))
    return jsonify(executor.metrics_trend(hours))


@app.route('/api/products', methods=['GET'])
def api_list_products():
    """상품 목록"""
    products = executor.product_list()
    return jsonify(products)


@app.route('/api/products/<product_id>', methods=['GET'])
def api_product_info(product_id):
    """상품 정보"""
    info = executor.product_info(product_id)
    if info:
        return jsonify(info)
    else:
        return jsonify({'error': f'Product not found: {product_id}'}), 404


@app.route('/api/products', methods=['POST'])
def api_create_product():
    """상품 생성"""
    data = request.get_json()
    name = data.get('name')
    dbfunc = data.get('dbfunc')
    config = data.get('config')

    if not name or not dbfunc:
        return jsonify({'error': 'name and dbfunc are required'}), 400

    success = executor.product_create(name, dbfunc, config)
    return jsonify({
        'success': success,
        'product': name,
        'message': '상품이 생성되었습니다.' if success else '상품 생성 실패'
    })


@app.route('/api/deploy', methods=['POST'])
def api_deploy_start():
    """배포 시작"""
    data = request.get_json()
    product = data.get('product')
    version = data.get('version')
    stage = data.get('stage', 'canary')

    success = executor.deploy_start(product, version, stage)
    return jsonify({
        'success': success,
        'message': '배포가 시작되었습니다.' if success else '배포 시작 실패'
    })


@app.route('/api/deploy/status', methods=['GET'])
def api_deploy_status():
    """배포 상태"""
    return jsonify(executor.deploy_status())


@app.route('/api/deploy/<deploy_id>/pause', methods=['POST'])
def api_deploy_pause(deploy_id):
    """배포 일시중지"""
    success = executor.deploy_pause(deploy_id)
    return jsonify({
        'success': success,
        'message': '배포가 일시중지되었습니다.' if success else '일시중지 실패'
    })


@app.route('/api/deploy/<deploy_id>/resume', methods=['POST'])
def api_deploy_resume(deploy_id):
    """배포 재개"""
    success = executor.deploy_resume(deploy_id)
    return jsonify({
        'success': success,
        'message': '배포가 재개되었습니다.' if success else '재개 실패'
    })


@app.route('/api/rollback', methods=['POST'])
def api_rollback_start():
    """롤백"""
    data = request.get_json()
    stage = data.get('stage')
    reason = data.get('reason')
    version = data.get('version')

    if not stage or not reason or not version:
        return jsonify({'error': 'stage, reason, version are required'}), 400

    success = executor.rollback_start(stage, reason, version)
    return jsonify({
        'success': success,
        'message': '롤백이 완료되었습니다.' if success else '롤백 실패'
    })


@app.route('/api/health', methods=['GET'])
def api_health():
    """헬스 체크"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Executor Web API Server')
    parser.add_argument('--port', type=int, default=5000, help='Port number (default: 5000)')
    parser.add_argument('--host', default='127.0.0.1', help='Host (default: 127.0.0.1)')

    args = parser.parse_args()

    print("[*] Executor Web Dashboard")
    print(f"[+] http://{args.host}:{args.port}")
    print("[OK] Open in browser")
    print()

    app.run(host=args.host, port=args.port, debug=False)


if __name__ == '__main__':
    main()
