import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useWorkshopsByOwner } from '@/hooks/useWorkshops';
import { useCreateEvent } from '@/hooks/useEvents';
import { useAppSelector } from '@/store/hooks';
import { Category, Workshop } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

const colors = Colors.dark;

const levels = [
  { id: 'beginner', label: 'Başlangıç' },
  { id: 'intermediate', label: 'Orta' },
  { id: 'advanced', label: 'İleri' },
  { id: 'all', label: 'Tüm Seviyeler' },
];

export default function CreateEventScreen() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 60 * 60 * 1000)); // +3 hours
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [level, setLevel] = useState<string>('all');
  const [requirements, setRequirements] = useState('');
  const [materialsIncluded, setMaterialsIncluded] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showWorkshopPicker, setShowWorkshopPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Fetch data
  const { data: categories = [] } = useCategories();
  const { data: workshops = [] } = useWorkshopsByOwner(user?.id || '');
  const createEvent = useCreateEvent();

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Hata', 'Etkinlik adı gerekli');
      return;
    }
    if (!selectedWorkshop) {
      Alert.alert('Hata', 'Atölye seçmelisiniz');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Hata', 'Açıklama gerekli');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Hata', 'Geçerli bir fiyat girin');
      return;
    }
    if (!capacity || parseInt(capacity) <= 0) {
      Alert.alert('Hata', 'Geçerli bir kapasite girin');
      return;
    }

    try {
      await createEvent.mutateAsync({
        workshop_id: selectedWorkshop,
        category_id: selectedCategory || undefined,
        title: title.trim(),
        description: description.trim(),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        capacity: parseInt(capacity),
        level: level as any,
        requirements: requirements.trim() || undefined,
        materials_included: materialsIncluded,
        is_active: true,
      });

      Alert.alert('Başarılı', 'Etkinlik oluşturuldu!', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Etkinlik oluşturulamadı');
    }
  };

  const selectedWorkshopData = workshops.find((w: Workshop) => w.id === selectedWorkshop);
  const selectedCategoryData = categories.find((c: Category) => c.id === selectedCategory);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Etkinlik</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Workshop Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Atölye *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowWorkshopPicker(!showWorkshopPicker)}
          >
            <Ionicons name="storefront-outline" size={20} color={colors.mutedForeground} />
            <Text style={[
              styles.selectButtonText,
              selectedWorkshop && { color: colors.foreground }
            ]}>
              {selectedWorkshopData?.name || 'Atölye seçin'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          {showWorkshopPicker && (
            <View style={styles.optionsList}>
              {workshops.length === 0 ? (
                <Text style={styles.emptyText}>Henüz atölyeniz yok</Text>
              ) : (
                workshops.map((workshop: Workshop) => (
                  <TouchableOpacity
                    key={workshop.id}
                    style={[
                      styles.optionItem,
                      selectedWorkshop === workshop.id && styles.optionItemSelected
                    ]}
                    onPress={() => {
                      setSelectedWorkshop(workshop.id);
                      setShowWorkshopPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedWorkshop === workshop.id && styles.optionTextSelected
                    ]}>
                      {workshop.name}
                    </Text>
                    {selectedWorkshop === workshop.id && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Etkinlik Adı *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Örn: Başlangıç Seramik Atölyesi"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Ionicons name="pricetag-outline" size={20} color={colors.mutedForeground} />
            <Text style={[
              styles.selectButtonText,
              selectedCategory && { color: colors.foreground }
            ]}>
              {selectedCategoryData?.name || 'Kategori seçin'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.optionsList}>
              {categories.map((category: Category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionItem,
                    selectedCategory === category.id && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={styles.categoryOption}>
                    <Ionicons name={category.icon as any} size={18} color={category.color} />
                    <Text style={[
                      styles.optionText,
                      selectedCategory === category.id && styles.optionTextSelected
                    ]}>
                      {category.name}
                    </Text>
                  </View>
                  {selectedCategory === category.id && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Açıklama *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Etkinlik hakkında detaylı bilgi..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Başlangıç Tarihi *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
            <Text style={styles.selectButtonText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowStartPicker(Platform.OS === 'ios');
                if (date) setStartDate(date);
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bitiş Tarihi *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
            <Text style={styles.selectButtonText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowEndPicker(Platform.OS === 'ios');
                if (date) setEndDate(date);
              }}
              minimumDate={startDate}
            />
          )}
        </View>

        {/* Price & Capacity */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>Fiyat (₺) *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>Eski Fiyat (₺)</Text>
            <TextInput
              style={styles.input}
              value={originalPrice}
              onChangeText={setOriginalPrice}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Kapasite *</Text>
          <TextInput
            style={styles.input}
            value={capacity}
            onChangeText={setCapacity}
            placeholder="Maksimum katılımcı sayısı"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
          />
        </View>

        {/* Level */}
        <View style={styles.section}>
          <Text style={styles.label}>Seviye</Text>
          <View style={styles.levelButtons}>
            {levels.map((l) => (
              <TouchableOpacity
                key={l.id}
                style={[
                  styles.levelButton,
                  level === l.id && styles.levelButtonSelected
                ]}
                onPress={() => setLevel(l.id)}
              >
                <Text style={[
                  styles.levelButtonText,
                  level === l.id && styles.levelButtonTextSelected
                ]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.label}>Gereksinimler</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={requirements}
            onChangeText={setRequirements}
            placeholder="Katılımcıların getirmesi gerekenler..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Materials Included */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setMaterialsIncluded(!materialsIncluded)}
        >
          <View style={[
            styles.checkbox,
            materialsIncluded && styles.checkboxChecked
          ]}>
            {materialsIncluded && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Malzemeler dahil</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            createEvent.isPending && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Etkinlik Oluştur</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: FontSizes.sm,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.sm,
  },
  selectButtonText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
  },
  optionsList: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionItemSelected: {
    backgroundColor: colors.primary + '1A',
  },
  optionText: {
    fontSize: FontSizes.sm,
    color: colors.foreground,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    padding: Spacing.lg,
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  levelButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelButtonText: {
    fontSize: FontSizes.sm,
    color: colors.foreground,
  },
  levelButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: FontSizes.sm,
    color: colors.foreground,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
});
