// pages/course_player/components/Quiz.jsx (UPDATED WITH STYLED COMPONENTS)
import React, { useState } from 'react';
import { Typography, Button, Progress, Card, Empty } from 'antd';
import styled from 'styled-components';
import styles from '../CoursePlayer.module.scss';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
const { Title, Text, Paragraph } = Typography;

const QuizContainer = styled(Card)``;
const HeaderSection = styled.div``;
const ProgressWrapper = styled.div``;
const QuestionSection = styled.div``;
const QuestionTitle = styled(Paragraph)``;
const OptionsContainer = styled.div``;
const OptionCard = styled.div``;
const OptionLetter = styled.span``;
const OptionText = styled(Paragraph)``;
const NavigationButtons = styled.div``;
const NavButton = styled(Button)``;
const ResultsSection = styled.div``;
const ScoreText = styled(Text)``;

const Quiz = ({ quizData = { questions: [] }, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const questions = quizData.questions;
  if (!questions.length) {
    return <Empty description="No quiz questions available." />;
  }
  const handleAnswer = (value, index) => {
    const newAnswers = { ...answers, [index]: value };
    setAnswers(newAnswers);
    if (showFeedback) setShowFeedback(false);
  };
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      const calculatedScore = questions.reduce((acc, q, idx) =>
        answers[idx] === q.correct ? acc + 1 : acc, 0
      );
      setScore(calculatedScore);
      setShowResults(true);
    }
  };
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowFeedback(false);
    }
  };
  const handleSubmit = () => {
    onComplete?.();
  };
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  if (showResults) {
    return (
      <QuizContainer className={styles.quizContainer}>
        <HeaderSection className={styles.headerSection}>
          <Title level={2} style={{ color: 'var(--text-primary)', margin: 0 }}>
            Quiz Complete!
          </Title>
          <ProgressWrapper className={styles.progressWrapper}>
            <Progress
              percent={100}
              status="success"
              strokeColor="var(--success)"
              showInfo={false}
              size="default"
            />
          </ProgressWrapper>
        </HeaderSection>
        <ResultsSection className={styles.resultsSection}>
          <ScoreText className={styles.scoreText}>
            {score}/{questions.length}
          </ScoreText>
          <Text strong style={{ fontSize: '18px', marginBottom: '24px' }}>
            {score >= 70 ? 'Excellent!' : score >= 50 ? 'Good job!' : 'Keep trying!'}
          </Text>
          <Paragraph style={{ marginBottom: '32px' }}>
            You got {score} out of {questions.length} questions correct.
          </Paragraph>
          <NavButton className={styles.navButton} type="primary" onClick={handleSubmit} icon={<CheckCircleOutlined />}>
            Continue to Next Topic
          </NavButton>
        </ResultsSection>
      </QuizContainer>
    );
  }
  return (
    <QuizContainer className={styles.quizContainer}>
      <HeaderSection className={styles.headerSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <Title level={4} style={{ color: 'var(--text-primary)', margin: 0, fontSize: '18px' }}>
            Question {currentQuestion + 1} of {questions.length}
          </Title>
          <Progress
            percent={progress}
            status="active"
            strokeColor="var(--primary)"
            showInfo={false}
            size="small"
          />
        </div>
      </HeaderSection>
      <QuestionSection className={styles.questionSection}>
        <QuestionTitle className={styles.questionTitle}>{currentQ.question}</QuestionTitle>
        <OptionsContainer className={styles.optionsContainer}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQuestion] === opt.value;
            const isCorrect = opt.value === currentQ.correct;
            let className = '';
            if (showFeedback) {
              if (isSelected && !isCorrect) className = 'incorrect';
              else if (isCorrect) className = 'correct';
            } else if (isSelected) {
              className = 'selected';
            }
            return (
              <OptionCard
                key={idx}
                className={`${className}`}
                onClick={() => handleAnswer(opt.value, currentQuestion)}
              >
                <OptionLetter>{opt.value}</OptionLetter>
                <OptionText>{opt.label}</OptionText>
              </OptionCard>
            );
          })}
        </OptionsContainer>
        {showFeedback && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
            <Text strong style={{ color: 'var(--success)' }}>Correct answer: {currentQ.options.find(o => o.value === currentQ.correct).label}</Text>
          </div>
        )}
      </QuestionSection>
      <NavigationButtons className={styles.navigationButtons}>
        <NavButton
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          icon={<ArrowLeftOutlined />}
        >
          Previous
        </NavButton>
        <NavButton
          type="primary"
          onClick={() => {
            if (answers[currentQuestion]) {
              if (currentQuestion === questions.length - 1) {
                handleNext();
              } else {
                setShowFeedback(true);
                setTimeout(() => handleNext(), 1500);
              }
            }
          }}
          disabled={!answers[currentQuestion]}
          icon={currentQuestion === questions.length - 1 ? <CheckCircleOutlined /> : <ArrowRightOutlined />}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </NavButton>
      </NavigationButtons>
    </QuizContainer>
  );
};
export default Quiz;