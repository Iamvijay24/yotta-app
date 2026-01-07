import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiMinus,
  FiPlus,
  FiUser,
  FiShield,
  FiZap
} from 'react-icons/fi';
import { message } from 'antd';
import styles from './Support.module.scss';
import { db } from "../../config/Firebase";
import { collection, addDoc } from "firebase/firestore";

const Container = styled.div``;
const ContentWrapper = styled.div``;
const Header = styled.div``;
const Title = styled.h1``;
const Subtitle = styled.p``;
const InfoCards = styled.div``;
const InfoCard = styled.div``;
const CardIcon = styled.div``;
const CardTitle = styled.h3``;
const CardDescription = styled.p``;
const EnquiryForm = styled.form``;
const FormGroup = styled.div``;
const Label = styled.label``;
const Input = styled.input``;
const Textarea = styled.textarea``;
const SubmitButton = styled.button``;
const FAQSection = styled.div``;
const FAQTitle = styled.h2``;
const FAQItem = styled.div``;
const FAQQuestion = styled.div``;
const FAQAnswer = styled.div``;
const ContactSection = styled.div``;
const ContactTitle = styled.h2``;
const IconButton = styled.button``;

const Support = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const purposeRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown === null) return;

      let ref;
      if (openDropdown === 'purpose') {
        ref = purposeRef.current;
      } else if (openDropdown === 'description') {
        ref = descriptionRef.current;
      }

      if (ref && !ref.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Browse our course catalog, select the course you want, and click the "Enroll" button. You can pay securely through our payment gateway. Once payment is confirmed, you will receive immediate access to all course materials. You can also track your enrollment history in your dashboard and manage multiple courses simultaneously.'
    },
    {
      question: 'How long do I have access to the course?',
      answer: 'Once you enroll, you have lifetime access to the course materials, including all future updates and additions. This means you can learn at your own pace without any time pressure. You can revisit lessons anytime, download resources, and benefit from any new content that gets added to the course over time.'
    },
    {
      question: 'What if I need help with course content?',
      answer: 'You can ask questions directly in the course discussion section, or reach out to our support team who can connect you with instructors. Our instructors typically respond within 24 hours during business days. Additionally, you can join study groups with fellow students and access our community forums where experienced learners share tips and insights.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit/debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with SSL encryption and processed through trusted gateways like Stripe. International users may incur currency conversion fees from their bank—select your preferred currency at checkout for the best rates.'
    },
    {
      question: 'How does the AI generate content?',
      answer: 'Our AI is trained on vast amounts of human-like text based on your input prompts and uses advanced language models to generate high-quality, relevant content tailored to your needs.'
    },
  ];

  const purposeOptions = [
    { value: '', label: 'Choose one option...' },
    { value: 'support', label: 'Support' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'others', label: 'Others' }
  ];

  const descriptionOptions = [
    { value: '', label: 'Choose one option...' },
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'others', label: 'Others' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "support_enquiries"), {
        ...formData,
        createdAt: new Date()
      });
      message.success("Form submitted successfully!");
      setFormData({
        purpose: '',
        description: '',
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error(error);
      message.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDropdownSelect = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    setOpenDropdown(null);
  };

  return (
    <Container className={styles.container}>
      <ContentWrapper className={styles.contentWrapper}>
        <Header className={styles.header}>
          <Title className={styles.title}>Need Assistance?</Title>
          <Subtitle className={styles.subtitle}>
            If you're feeling overwhelmed, remember you don't have to face it alone. <br />
            Reach out and get the help you need
          </Subtitle>
        </Header>
        <InfoCards className={styles.infoCards}>
          <InfoCard className={styles.infoCard}>
            <CardIcon className={styles.cardIcon}>
              <FiZap />
            </CardIcon>
            <CardTitle className={styles.cardTitle}>Getting Started</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Learn how to set up your account, explore key features, and get the most.
            </CardDescription>
          </InfoCard>
          <InfoCard className={styles.infoCard}>
            <CardIcon className={styles.cardIcon}>
              <FiShield />
            </CardIcon>
            <CardTitle className={styles.cardTitle}>Security & Protection</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Keep your account safe with our advanced security measures.
            </CardDescription>
          </InfoCard>
          <InfoCard className={styles.infoCard}>
            <CardIcon className={styles.cardIcon}>
              <FiUser />
            </CardIcon>
            <CardTitle className={styles.cardTitle}>Account & Subscription</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Manage your account settings, update subscription plans, and others.
            </CardDescription>
          </InfoCard>
        </InfoCards>
        <FAQSection className={styles.fAQSection}>
          <div className={styles.fAQLeft}>
            <FAQTitle className={styles.fAQTitle}>FAQ's</FAQTitle>
            <p className={styles.fAQDescription}>Everything you need to know about the product and other information. Can't find the answer you're looking for?</p>
            <p className={styles.fAQDescription}>
              Reach us at <a
                href="mailto:support@yottaacademy.com"
                className={styles.fAQEmail}
                target="_blank"
                rel="noopener noreferrer"
              >
                support@yottaacademy.com
              </a>
            </p>
          </div>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className={styles.fAQItem}
              >
                <FAQQuestion className={styles.fAQQuestion}>
                  {faq.question}
                  <IconButton
                    className={styles.iconButtons}
                    aria-label={openFAQ === index ? "Collapse" : "Expand"}
                  >
                    {openFAQ === index ? <FiMinus /> : <FiPlus />}
                  </IconButton>
                </FAQQuestion>
                <FAQAnswer
                  className={`${styles.fAQAnswer} ${openFAQ === index ? styles.open : ''}`}
                >
                  {faq.answer}
                </FAQAnswer>
              </FAQItem>
            ))}
          </div>
        </FAQSection>
        <ContactSection className={styles.contactSection}>
          <ContactTitle className={styles.contactTitle}>Let's Get in Touch</ContactTitle>
          <EnquiryForm className={styles.enquiryForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <FormGroup className={styles.formGroup}>
                <Label className={styles.label}>Inquiry Purpose *</Label>
                <div className={styles.customSelectWrapper} ref={purposeRef}>
                  <div
                    className={styles.customSelectTrigger}
                    onClick={() => setOpenDropdown(openDropdown === 'purpose' ? null : 'purpose')}
                  >
                    <span className={formData.purpose ? styles.selectedValue : styles.placeholder}>
                      {purposeOptions.find(opt => opt.value === formData.purpose)?.label || 'Choose one option...'}
                    </span>
                    <span className={`${styles.arrow} ${openDropdown === 'purpose' ? styles.arrowOpen : ''}`}>
                      {openDropdown === 'purpose' ? <FiMinus /> : <FiPlus />}
                    </span>
                  </div>
                  {openDropdown === 'purpose' && (
                    <div className={styles.customSelectDropdown}>
                      {purposeOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`${styles.customSelectOption} ${option.value === '' ? styles.placeholderOption : ''} ${formData.purpose === option.value ? styles.selectedOption : ''}`}
                          onClick={() => option.value !== '' && handleDropdownSelect('purpose', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormGroup>
              <FormGroup className={styles.formGroup}>
                <Label className={styles.label}>Description that fits you *</Label>
                <div className={styles.customSelectWrapper} ref={descriptionRef}>
                  <div
                    className={styles.customSelectTrigger}
                    onClick={() => setOpenDropdown(openDropdown === 'description' ? null : 'description')}
                  >
                    <span className={formData.description ? styles.selectedValue : styles.placeholder}>
                      {descriptionOptions.find(opt => opt.value === formData.description)?.label || 'Choose one option...'}
                    </span>
                    <span className={`${styles.arrow} ${openDropdown === 'description' ? styles.arrowOpen : ''}`}>
                      {openDropdown === 'description' ? <FiMinus /> : <FiPlus />}
                    </span>
                  </div>
                  {openDropdown === 'description' && (
                    <div className={styles.customSelectDropdown}>
                      {descriptionOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`${styles.customSelectOption} ${option.value === '' ? styles.placeholderOption : ''} ${formData.description === option.value ? styles.selectedOption : ''}`}
                          onClick={() => option.value !== '' && handleDropdownSelect('description', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormGroup>
            </div>
            <div className={styles.formRow}>
              <FormGroup className={styles.formGroup}>
                <Label className={styles.label}>Full Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name..."
                  required
                  className={styles.input}
                />
              </FormGroup>
              <FormGroup className={styles.formGroup}>
                <Label className={styles.label}>Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  required
                  className={styles.input}
                />
              </FormGroup>
            </div>
            <div className={styles.formRow}>
              <FormGroup className={styles.formGroup}>
                <Label className={styles.label}>Phone Number</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number..."
                  className={styles.input}
                />
              </FormGroup>
            </div>
            <FormGroup className={styles.formGroup}>
              <Label className={styles.label}>Message *</Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message here..."
                rows="6"
                required
                className={styles.textarea}
              />
            </FormGroup>
            <SubmitButton
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </SubmitButton>
          </EnquiryForm>
        </ContactSection>
      </ContentWrapper>
    </Container>
  );
};

export default Support;