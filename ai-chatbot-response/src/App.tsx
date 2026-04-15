import { useState, useEffect } from 'react';
import type { Category, FinancialTodo } from './types';
import type { SceneKey } from './data/mockScenes';
import { useChatState } from './hooks/useChatState';
import { useModalState } from './hooks/useModalState';
import { useSubPanelState } from './hooks/useSubPanelState';
import { usePageState } from './hooks/usePageState';
import { useToast } from './hooks/useToast';
import { useMobileUI } from './hooks/useMobileUI';
import { useMobileNavigation } from './hooks/useMobileNavigation';
import { useFinancialTodo } from './hooks/useFinancialTodo';
import { startQuestionScheduler } from './services/questionScheduler';
import AppLayout from './layout/AppLayout';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import InputBar from './layout/InputBar';
import ChatArea from './chat/ChatArea';
import WelcomeScreen from './chat/WelcomeScreen';
import FinancialTodoPage from './pages/FinancialTodoPage';
import MobileNotifications from './components/MobileNotifications';
import SubPanel from './components/SubPanel';
import Toast from './components/Toast';
import ModelSelectModal from './modals/ModelSelectModal';
import ShareModal from './modals/ShareModal';
import EmailModal from './modals/EmailModal';
import ConfirmModal from './modals/ConfirmModal';
import SendMethodModal from './modals/SendMethodModal';
import FinancialTodoModal from './modals/FinancialTodoModal';
import QuestionAnswerModal from './modals/QuestionAnswerModal';

export default function App() {
  const chat = useChatState();
  const { modal, openModal, closeModal } = useModalState();
  const { subPanel, togglePanel, closePanel } = useSubPanelState();
  const { currentPage, navigateTo, goBack } = usePageState();
  const { toast, showToast, dismissToast } = useToast();
  const { isMobile } = useMobileUI();
  const mobileNav = useMobileNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const financialTodo = useFinancialTodo();
  const [editingTodo, setEditingTodo] = useState<FinancialTodo | undefined>(undefined);
  const [selectedQuestion, setSelectedQuestion] = useState<FinancialTodo | null>(null);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);

  const handleCategorySelect = (cat: Category) => {
    chat.selectCategory(cat);
    chat.loadScene(cat as SceneKey);
    setMobileMenuOpen(false);
  };

  const handleWelcomeCategorySelect = (cat: Category) => {
    chat.selectCategory(cat);
  };

  const handleQuestionClick = (text: string) => {
    chat.sendMessage(text);
  };

  const handleShareAction = (action: string) => {
    if (action === 'share') {
      openModal('share');
    } else if (action === 'email') {
      openModal('email');
    } else if (action === 'mobile') {
      openModal('kakao-preview'); // SendMethodModal (MMS + KakaoTalk)
    } else if (action === 'pdf') {
      showToast({ type: 'info', message: 'PDF 다운로드를 시작합니다.' });
    } else if (action === 'excel') {
      showToast({ type: 'info', message: 'Excel 다운로드를 시작합니다.' });
    } else if (action === 'save') {
      showToast({ type: 'success', message: '보고서가 저장되었습니다.' });
    } else if (action === 'report-issue') {
      openModal('confirm');
    } else if (action === 'download') {
      showToast({ type: 'info', message: '매뉴얼 다운로드를 시작합니다.' });
    }
  };

  const handleNewChat = () => {
    chat.clearMessages();
    setMobileMenuOpen(false);
  };

  const handleAddFinancialTodo = () => {
    setEditingTodo(undefined);
    openModal('financial-todo');
  };

  const handleEditFinancialTodo = (todo: FinancialTodo) => {
    setEditingTodo(todo);
    openModal('financial-todo');
  };

  const handleSaveFinancialTodo = (todoData: Omit<FinancialTodo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTodo) {
      financialTodo.updateTodo(editingTodo.id, todoData);
      showToast({ type: 'success', message: 'To-Do가 수정되었습니다.' });
    } else {
      financialTodo.addTodo(todoData);
      showToast({ type: 'success', message: 'To-Do가 추가되었습니다.' });
    }
    setEditingTodo(undefined);
    closeModal();
  };

  const handleViewAnswer = (todo: FinancialTodo) => {
    setSelectedQuestion(todo);
    setAnswerModalOpen(true);
  };

  const handleGenerateAnswer = async (id: string) => {
    try {
      await financialTodo.generateAnswer(id);
      showToast({ type: 'success', message: '답변이 생성되었습니다.' });
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : '답변 생성에 실패했습니다.',
      });
    }
  };

  // 질문 To-Do 스케줄러 초기화
  useEffect(() => {
    const unsubscribe = startQuestionScheduler(
      financialTodo.todos,
      handleGenerateAnswer,
      60000 // 1분마다 체크
    );

    return unsubscribe;
  }, [financialTodo.todos]);

  return (
    <>
      <AppLayout
        sidebar={
          <Sidebar
            selectedCategory={chat.selectedCategory}
            activePanel={subPanel}
            currentPage={currentPage}
            onCategorySelect={handleCategorySelect}
            onPanelToggle={togglePanel}
            onNavigatePage={navigateTo}
            onNewChat={handleNewChat}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        }
        header={
          <Header
            onModelClick={() => openModal('model-select')}
            onMenuToggle={() => setMobileMenuOpen(true)}
            onNotificationClick={isMobile ? mobileNav.goToNotifications : undefined}
          />
        }
        inputBar={
          currentPage === 'financial-todo'
            ? undefined
            : chat.messages.length > 0
              ? (
                  <InputBar
                    onSend={chat.sendMessage}
                    disabled={chat.loading}
                    selectedCategory={chat.selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                )
              : undefined
        }
        subPanel={
          subPanel ? (
            <SubPanel
              type={subPanel}
              onClose={closePanel}
              financialTodoData={
                subPanel === 'financial-todo'
                  ? {
                      todos: financialTodo.todos,
                      onAddTodo: handleAddFinancialTodo,
                      onEditTodo: handleEditFinancialTodo,
                      onDeleteTodo: financialTodo.deleteTodo,
                      onToggleComplete: financialTodo.toggleComplete,
                      onViewAnswer: handleViewAnswer,
                      onGenerateAnswer: handleGenerateAnswer,
                    }
                  : undefined
              }
            />
          ) : undefined
        }
      >
        {/* V13 Notifications — 모바일에서 알림 탭 시 전체 교체 */}
        {isMobile && mobileNav.mobilePage === 'notifications' ? (
          <MobileNotifications
            onBack={mobileNav.goBack}
            onNotificationClick={() => {
              mobileNav.goToChat();
            }}
          />
        ) : currentPage === 'financial-todo' ? (
          <FinancialTodoPage
            todos={financialTodo.todos}
            onBack={goBack}
            onAddTodo={handleAddFinancialTodo}
            onEditTodo={handleEditFinancialTodo}
            onDeleteTodo={financialTodo.deleteTodo}
            onToggleComplete={financialTodo.toggleComplete}
            onViewAnswer={handleViewAnswer}
            onGenerateAnswer={handleGenerateAnswer}
          />
        ) : chat.messages.length === 0 ? (
          <WelcomeScreen
            selectedCategory={chat.selectedCategory}
            onCategorySelect={handleWelcomeCategorySelect}
            onQuestionClick={handleQuestionClick}
          />
        ) : (
          <ChatArea
            messages={chat.messages}
            loading={chat.loading}
            onQuestionClick={(q) => chat.sendMessage(q)}
            onShareAction={handleShareAction}
          />
        )}
      </AppLayout>

      {/* Modals */}
      {modal === 'model-select' && (
        <ModelSelectModal
          currentModel={chat.selectedModel}
          onSelect={chat.selectModel}
          onClose={closeModal}
        />
      )}
      {modal === 'share' && (
        <ShareModal
          onClose={closeModal}
          onOpenModal={openModal}
          onToast={(msg) => showToast({ type: 'success', message: msg })}
        />
      )}
      {modal === 'email' && (
        <EmailModal
          onClose={closeModal}
          onToast={(msg) => showToast({ type: 'success', message: msg })}
        />
      )}
      {modal === 'confirm' && (
        <ConfirmModal
          title="이상거래 신고"
          message="선택한 거래를 이상거래로 신고하시겠습니까?"
          onConfirm={() => showToast({ type: 'success', message: '신고가 접수되었습니다.' })}
          onClose={closeModal}
        />
      )}
      {modal === 'kakao-preview' && (
        <SendMethodModal
          onClose={closeModal}
          onToast={(msg) => showToast({ type: 'success', message: msg })}
        />
      )}
      {modal === 'financial-todo' && (
        <FinancialTodoModal
          isOpen={true}
          todo={editingTodo}
          onClose={closeModal}
          onSave={handleSaveFinancialTodo}
        />
      )}

      {/* Question Answer Modal */}
      <QuestionAnswerModal
        isOpen={answerModalOpen}
        todo={selectedQuestion}
        onClose={() => setAnswerModalOpen(false)}
        onRetry={handleGenerateAnswer}
      />

      {/* Toast */}
      {toast && <Toast toast={toast} onDismiss={dismissToast} />}
    </>
  );
}
