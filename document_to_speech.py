#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
한국어 문서를 음성으로 변환하는 Python 스크립트
Text-to-Speech (TTS) 자동화 도구

지원 포맷: .txt, .docx, .pdf
출력 형식: MP3 파일
"""

import os
import sys
import argparse
import logging
from pathlib import Path
from typing import Optional

from gtts import gTTS
from docx import Document
import pdfplumber
from tqdm import tqdm


# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('document_to_speech.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class DocumentToSpeech:
    """문서를 음성 파일로 변환하는 클래스"""

    def __init__(self, lang: str = 'ko'):
        """
        초기화

        Args:
            lang: 음성 언어 코드 (기본값: 'ko' - 한국어)
        """
        self.lang = lang
        self.supported_formats = ['.txt', '.docx', '.pdf', '.doc']

    def extract_text(self, file_path: str) -> str:
        """
        파일 포맷에 따라 텍스트 추출

        Args:
            file_path: 입력 파일 경로

        Returns:
            추출된 텍스트

        Raises:
            ValueError: 지원하지 않는 파일 포맷
        """
        file_ext = Path(file_path).suffix.lower()

        if file_ext not in self.supported_formats:
            raise ValueError(f"지원하지 않는 파일 포맷입니다: {file_ext}\n"
                           f"지원 포맷: {', '.join(self.supported_formats)}")

        logger.info(f"파일에서 텍스트 추출 중: {file_path}")

        try:
            if file_ext == '.txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()

            elif file_ext == '.docx':
                doc = Document(file_path)
                text = '\n'.join([para.text for para in doc.paragraphs])

            elif file_ext == '.pdf':
                text = ""
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text() or ""
                        text += "\n"

            else:
                raise ValueError(f"지원하지 않는 파일 포맷: {file_ext}")

            # 공백 정리
            text = '\n'.join(line.strip() for line in text.split('\n')
                            if line.strip())

            logger.info(f"텍스트 추출 완료: {len(text)} 글자")
            return text

        except Exception as e:
            logger.error(f"텍스트 추출 실패: {str(e)}")
            raise

    def _split_text(self, text: str, chunk_size: int = 3000) -> list:
        """
        긴 텍스트를 청크로 분할 (gTTS의 제한사항 대응)

        Args:
            text: 원본 텍스트
            chunk_size: 청크 크기 (기본값: 3000글자)

        Returns:
            텍스트 청크 리스트
        """
        chunks = []
        current_chunk = ""

        for sentence in text.split('\n'):
            if len(current_chunk) + len(sentence) > chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = sentence
            else:
                current_chunk += ('\n' if current_chunk else '') + sentence

        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    def text_to_speech(self, text: str, output_path: str,
                      slow: bool = False) -> None:
        """
        텍스트를 음성 파일로 변환

        Args:
            text: 변환할 텍스트
            output_path: 출력 MP3 파일 경로
            slow: 느린 속도 여부
        """
        logger.info(f"음성 변환 시작: {output_path}")

        try:
            # 텍스트 길이 제한으로 인해 청크로 분할
            chunks = self._split_text(text)
            logger.info(f"텍스트를 {len(chunks)}개 청크로 분할")

            # 첫 번째 청크로 TTS 객체 생성
            tts = gTTS(text=chunks[0], lang=self.lang, slow=slow)

            # 나머지 청크 추가
            for chunk in tqdm(chunks[1:], desc="음성 변환 중",
                            disable=len(chunks) <= 1):
                chunk_tts = gTTS(text=chunk, lang=self.lang, slow=slow)
                tts.write_to_fp(chunk_tts)

            # 파일로 저장
            output_dir = Path(output_path).parent
            output_dir.mkdir(parents=True, exist_ok=True)

            tts.save(output_path)

            file_size = os.path.getsize(output_path) / (1024 * 1024)
            logger.info(f"음성 변환 완료: {output_path} ({file_size:.2f} MB)")

        except Exception as e:
            logger.error(f"음성 변환 실패: {str(e)}")
            raise

    def convert(self, input_path: str, output_path: Optional[str] = None,
               slow: bool = False) -> str:
        """
        문서를 음성 파일로 변환 (전체 프로세스)

        Args:
            input_path: 입력 파일 경로
            output_path: 출력 파일 경로 (기본값: 입력파일명.mp3)
            slow: 느린 속도 여부

        Returns:
            생성된 MP3 파일 경로
        """
        input_path = Path(input_path)

        # 입력 파일 확인
        if not input_path.exists():
            raise FileNotFoundError(f"파일을 찾을 수 없습니다: {input_path}")

        # 출력 경로 설정
        if output_path is None:
            output_path = input_path.with_suffix('.mp3')

        output_path = Path(output_path)

        try:
            # 텍스트 추출
            text = self.extract_text(str(input_path))

            # 텍스트 검증
            if not text or len(text.strip()) == 0:
                raise ValueError("추출된 텍스트가 없습니다")

            # 음성으로 변환
            self.text_to_speech(text, str(output_path), slow=slow)

            logger.info(f"변환 완료: {input_path} → {output_path}")
            return str(output_path)

        except Exception as e:
            logger.error(f"변환 실패: {str(e)}")
            raise


def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description='한국어 문서를 음성(MP3)으로 변환합니다',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  python document_to_speech.py sample.txt
  python document_to_speech.py sample.docx output.mp3
  python document_to_speech.py sample.pdf --slow
        """
    )

    parser.add_argument('input', help='입력 파일 경로 (.txt, .docx, .pdf)')
    parser.add_argument('output', nargs='?', default=None,
                       help='출력 MP3 파일 경로 (기본값: 입력파일명.mp3)')
    parser.add_argument('--slow', action='store_true',
                       help='느린 속도로 음성 생성')
    parser.add_argument('--lang', default='ko',
                       help='음성 언어 코드 (기본값: ko)')

    args = parser.parse_args()

    try:
        converter = DocumentToSpeech(lang=args.lang)
        output_file = converter.convert(args.input, args.output, slow=args.slow)
        print(f"\n[OK] 변환 완료!\n생성 파일: {output_file}")

    except Exception as e:
        print(f"\n[ERROR] 오류 발생: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
