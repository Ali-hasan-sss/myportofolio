# مكونات المشروع

## المكونات الأساسية

### 1. Modal

مكون مودال جميل ومرتب يمكن استخدامه في جميع أنحاء المشروع.

**الخصائص:**

- `isOpen`: boolean - حالة فتح/إغلاق المودال
- `onClose`: function - دالة إغلاق المودال
- `title`: string - عنوان المودال
- `children`: ReactNode - محتوى المودال
- `size`: "sm" | "md" | "lg" | "xl" | "full" - حجم المودال
- `loading`: boolean - حالة التحميل
- `showCloseButton`: boolean - إظهار زر الإغلاق

**المميزات:**

- إغلاق بالضغط على ESC
- إغلاق بالنقر على الخلفية
- منع التمرير في الخلفية
- تأثيرات انتقالية جميلة
- دعم حالة التحميل

### 2. Button

مكون زر محسن مع عدة أنماط وأحجام.

**الخصائص:**

- `children`: ReactNode - محتوى الزر
- `variant`: "primary" | "secondary" | "success" | "danger" | "warning" | "ghost" - نمط الزر
- `size`: "sm" | "md" | "lg" - حجم الزر
- `loading`: boolean - حالة التحميل
- `disabled`: boolean - حالة التعطيل
- `type`: "button" | "submit" | "reset" - نوع الزر
- `onClick`: function - دالة النقر
- `className`: string - classes إضافية
- `icon`: ReactNode - أيقونة الزر

### 3. FormField Components

#### FormField

مكون أساسي لحقول النماذج.

#### InputField

مكون لحقول الإدخال النصية.

#### TextareaField

مكون لحقول النصوص الطويلة.

#### FileField

مكون لحقول رفع الملفات.

**المميزات المشتركة:**

- دعم الأخطاء
- الحقول المطلوبة
- تصميم متناسق
- دعم التعطيل
- تأثيرات التركيز

## استخدام المكونات

### مثال على استخدام Modal:

```tsx
import Modal from "@/components/Modal";

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="عنوان المودال"
  size="lg"
>
  <p>محتوى المودال</p>
</Modal>;
```

### مثال على استخدام Button:

```tsx
import Button from "@/components/Button";
import { Edit } from "lucide-react";

<Button
  onClick={handleClick}
  variant="primary"
  icon={<Edit className="w-4 h-4" />}
  loading={loading}
>
  تعديل البيانات
</Button>;
```

### مثال على استخدام FormField:

```tsx
import { InputField, TextareaField } from "@/components/FormField";

<InputField
  label="الاسم"
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
  error={errors.name}
/>

<TextareaField
  label="الوصف"
  name="description"
  value={formData.description}
  onChange={handleChange}
  rows={4}
/>
```

## التصميم

جميع المكونات تستخدم:

- Tailwind CSS للتصميم
- نظام ألوان متناسق
- تأثيرات انتقالية سلسة
- تصميم متجاوب
- دعم الوضع المظلم

## الأيقونات

المشروع يستخدم Lucide React للأيقونات:

```tsx
import { Edit, Download, User, Mail, Phone } from "lucide-react";
```
