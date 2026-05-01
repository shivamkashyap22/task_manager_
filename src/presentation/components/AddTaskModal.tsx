import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Platform, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../state/taskStore';
import { Task } from '../../domain/models/Task';
import { COLORS } from '../theme/colors';
import { Validations } from '../../domain/utils/validations';
import { showSuccessToast, showErrorToast } from '../../domain/utils/toastManager';
import { LinearGradient } from 'expo-linear-gradient';

interface Props { 
  visible: boolean; 
  onClose: () => void; 
  taskToEdit?: Task; 
}

interface FieldErrors {
  title?: string;
  description?: string;
  category?: string;
  dueDate?: string;
}

const AddTaskModal = ({ visible, onClose, taskToEdit }: Props) => {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDate(new Date(taskToEdit.dueDate));
    } else {
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('medium');
      setDate(new Date());
    }
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [taskToEdit, visible]);

  const validateField = (fieldName: string, value: any): string | undefined => {
    switch (fieldName) {
      case 'title':
        return Validations.validateTaskTitle(value).error;
      case 'description':
        return Validations.validateTaskDescription(value).error;
      case 'category':
        return Validations.validateCategory(value).error;
      case 'dueDate':
        return Validations.validateDueDate(value).error;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, fieldName === 'dueDate' ? date : fieldName === 'description' ? description : fieldName === 'title' ? title : category);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (touched.title) {
      const error = Validations.validateTaskTitle(text).error;
      setErrors(prev => ({ ...prev, title: error }));
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (touched.description) {
      const error = Validations.validateTaskDescription(text).error;
      setErrors(prev => ({ ...prev, description: error }));
    }
  };

  const handleCategoryChange = (text: string) => {
    setCategory(text);
    if (touched.category) {
      const error = Validations.validateCategory(text).error;
      setErrors(prev => ({ ...prev, category: error }));
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    
    if (touched.dueDate) {
      const error = Validations.validateDueDate(currentDate).error;
      setErrors(prev => ({ ...prev, dueDate: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};
    
    const titleError = Validations.validateTaskTitle(title).error;
    if (titleError) newErrors.title = titleError;
    
    const descError = Validations.validateTaskDescription(description).error;
    if (descError) newErrors.description = descError;
    
    const catError = Validations.validateCategory(category).error;
    if (catError) newErrors.category = catError;
    
    const dateError = Validations.validateDueDate(date).error;
    if (dateError) newErrors.dueDate = dateError;
    
    setErrors(newErrors);
    setTouched({ title: true, description: true, category: true, dueDate: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showErrorToast('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskPayload = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        priority,
        dueDate: date.getTime()
      };

      if (taskToEdit) {
        await updateTask(taskToEdit.id, taskPayload);
        showSuccessToast('Task updated successfully');
      } else {
        await addTask(taskPayload as any);
        showSuccessToast('Task created successfully');
      }
      
      onClose();
    } catch (error) {
      showErrorToast('Failed to save task. Please try again.');
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#0a0a0a', '#141414', '#0a0a0a']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{taskToEdit ? 'EDIT TASK' : 'NEW TASK'}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.fieldContainer, errors.title && styles.fieldError]}>
              <Text style={styles.fieldLabel}>Task Title *</Text>
              <TextInput
                value={title}
                onChangeText={handleTitleChange}
                onBlur={() => handleFieldBlur('title')}
                style={styles.input}
                placeholder="Enter task title"
                placeholderTextColor={COLORS.subtleText}
                maxLength={100}
                theme={{
                  colors: {
                    text: COLORS.text,
                    primary: COLORS.accent,
                    background: COLORS.card,
                  },
                }}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            <View style={[styles.fieldContainer, errors.description && styles.fieldError]}>
              <Text style={styles.fieldLabel}>Description (Optional)</Text>
              <TextInput
                value={description}
                onChangeText={handleDescriptionChange}
                onBlur={() => handleFieldBlur('description')}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                placeholder="Add task details..."
                placeholderTextColor={COLORS.subtleText}
                maxLength={500}
                theme={{
                  colors: {
                    text: COLORS.text,
                    primary: COLORS.accent,
                    background: COLORS.card,
                  },
                }}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>

            <View style={[styles.fieldContainer, errors.category && styles.fieldError]}>
              <Text style={styles.fieldLabel}>Category *</Text>
              <TextInput
                value={category}
                onChangeText={handleCategoryChange}
                onBlur={() => handleFieldBlur('category')}
                style={styles.input}
                placeholder="e.g., Work, Personal, Study"
                placeholderTextColor={COLORS.subtleText}
                maxLength={50}
                theme={{
                  colors: {
                    text: COLORS.text,
                    primary: COLORS.accent,
                    background: COLORS.card,
                  },
                }}
              />
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Priority</Text>
              <View style={styles.chipContainer}>
                {(['low', 'medium', 'high'] as const).map(p => {
                  const priorityColors = {
                    low: { bg: '#0a1a0a', border: '#0a2a0a', text: '#32d74b' },
                    medium: { bg: '#1a1000', border: '#2a1a00', text: '#ffd60a' },
                    high: { bg: '#2a0a0a', border: '#3a0a0a', text: '#ff453a' },
                  };
                  const colors = priorityColors[p];
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      disabled={isSubmitting}
                    >
                      <View style={[
                        styles.priorityChip,
                        priority === p && styles.priorityChipSelected,
                        { borderColor: colors.border }
                      ]}>
                        <Text style={[
                          styles.priorityChipText,
                          priority === p && { color: '#000' },
                          { color: priority === p ? '#000' : colors.text }
                        ]}>
                          {p.toUpperCase()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.fieldContainer, errors.dueDate && styles.fieldError]}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => !isSubmitting && setShowDatePicker(true)}
                disabled={isSubmitting}
              >
                <Text style={styles.dateButtonText}>Due Date: {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              </TouchableOpacity>
              {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
            </View>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={['#00d4aa', '#00a896']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'SAVING...' : taskToEdit ? 'UPDATE TASK' : 'CREATE TASK'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeIcon: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldError: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.subtleText,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorText: {
    color: '#ff453a',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  charCount: {
    fontSize: 11,
    color: COLORS.subtleText,
    textAlign: 'right',
    marginTop: 6,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  priorityChipSelected: {
    backgroundColor: COLORS.accent,
  },
  priorityChipText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateButton: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateButtonText: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default AddTaskModal;