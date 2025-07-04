import { ColumnDef } from "@tanstack/react-table";

// CONSTANTS

export const ENGR_BLDG = "ENGR_LAB_BUILDING";
export const WELLNESS = "HEALTH_AND_WELLNESS";
export const ITB = "ITB";
export const MAB = "MAB";
export const OB = "OB";
export const RND = "R&D";
export const SNAGAH = "SNAGAH";
export const JVE = "JVE";

export const MIC = {
  folder: "Highlights",
  floor: "mic.jpg",
};

export const CASHIER = {
  folder: "Highlights",
  floor: "cashier.jpg",
};

export const CPE_DEPT = {
  folder: "Highlights",
  floor: "cpe_dept.jpg",
};

export const COOP = {
  folder: "Highlights",
  floor: "coop.jpg",
};

export const OFFICE_PRESIDENT = {
  folder: "Highlights",
  floor: "office_president.jpg",
};

export const REGISTRAR = {
  folder: "Highlights",
  floor: "registrar.jpg",
};

export const SCHOLARSHIP_AND_FINANCIAL_ASSISTANCE_UNIT = {
  folder: "Highlights",
  floor: "scholarship.jpg",
};
export const STUDENT_AND_ALUMNI_AFFAIRS_SERVICES = {
  folder: "Highlights",
  floor: "student_alumni.jpg",
};

export const CEIT_DEAN_OFFICE = {
  folder: "Highlights",
  floor: "office_ceit_dean.jpg",
};

export const COE = {
  folder: "Highlights",
  floor: "cooperative_education_office.jpg",
};

export const CULTURAL_AFFAIRS_OFFICE = {
  folder: "Highlights",
  floor: "cultural_affairs.jpg",
};

export const ECE_DEPT = {
  folder: "Highlights",
  floor: "ece_dept.jpg",
};

export interface ImageData {
  filename: string;
  duration: number;
}

export interface ProfessorList {
  email: string;
  id: number;
  name: string;
  office_hours: string;
  professor_id: string;
}

export interface Professor {
  first_name: string;
  last_name: string;
  email: string;
  office_hours: string;
  title: string;
}

export interface CreateProfessor {
  first_name: string;
  last_name: string;
  email: string;
  office_hours: string;
  title: string;
  username: string;
  password: string;
}

export interface Message {
  sender: "user" | "bot";
  text: string;
}

export interface PersonalInfoPageProps {
  setStudentInformation: (info: {
    student_name: string;
    student_id: string;
    student_email: string;
    concern: string;
    isEmailVerified: boolean;
  }) => void;
  initialData: {
    student_name: string;
    student_id: string;
    student_email: string;
    concern: string;
    isEmailVerified: boolean;
  };
}

export interface ProfessorInfoPageProps {
  setStudentInformation: (info: {
    professor_uuid: string;
    start_time: string;
    end_time: string;
    isDateValid: boolean;
    isTimeValid: boolean;
    professorName: string;
  }) => void;
  initialData: {
    professor_uuid: string;
    start_time: string;
    end_time: string;
    isDateValid: boolean;
    isTimeValid: boolean;
  };
}

export interface Appointment {
  student_name: string;
  student_id: string;
  student_email: string;
  professor_uuid: string;
  concern: string;
  start_time: string;
  end_time: string;
}

export interface CreateProfessorDialogProps {
  onRefresh?: () => void;
}

export interface DateTimePickerProps {
  getDate: (date: Date) => void;
  disabled?: boolean;
}

export interface DeleteDialogProps {
  onConfirm?: () => void;
  isButtonDisabled?: boolean;
}

export interface FAQCardProps {
  idProp: number;
  questionProp: string;
  synonymsProp: string[];
  answerProp: string;
  isPinnedProp: boolean;
  onRefresh?: () => void;
}

export interface FAQ {
  id: number;
  question: string;
  synonyms: string[];
  answer: string;
  isPinned: boolean;
}

export interface FAQDialogProps {
  onRefresh?: () => void;
}

export interface KeyboardContextProps {
  showKeyboard: (
    inputValue: string,
    onChange: (value: string) => void,
    maxLength?: number,
    keyboardType?: "numeric" | "alphanumeric" | "email"
  ) => void;
  hideKeyboard: () => void;
  isKeyboardVisible: boolean;
}

export interface KeyboardInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  keyboardType?: "numeric" | "alphanumeric" | "email";
}

export interface KeyboardTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  keyboardType?: "numeric" | "alphanumeric" | "email";
}

export interface MarkdownResponseProps {
  response: string;
}

export interface CalendarComponentProps {
  getDate?: (date: string) => void;
  disabled?: boolean;
}

export interface OTPDialogProps {
  email: string;
  onVerified: () => void;
}

export interface TimeRangeProps {
  startTime: string;
  endTime: string;
}

export interface TimePickerProps {
  onChange?: (timeRange: TimeRangeProps) => void;
  defaultStartHour?: string;
  defaultEndHour?: string;
  defaultStartMinute?: string; // New prop
  defaultEndMinute?: string; // New prop
  defaultStartPeriod?: string;
  defaultEndPeriod?: string;
  className?: string;
  disabled?: boolean;
  // New props for limiting hours
  minHour?: number; // 0-23, 24-hour format
  maxHour?: number; // 0-23, 24-hour format
  scheduled?: BookedTimeSlot[];
}

export interface BookedTimeSlot {
  start_time: string;
  end_time: string;
}
export interface UploadCardProps {
  onUploadComplete?: () => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Make these optional with defaults
  onRowSelectionChange?: (value: any) => void;
  rowSelection?: any;
  // Add customization options
  headerClassName?: string;
  emptyMessage?: string;
  caption?: React.ReactNode;
  enableSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  actions?: React.ReactNode;
  maxHeight?: string;
}

export interface buildingDialogProps {
  props: string;
  setTitle: (title: string) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
}

export interface EditProfileDialogProps {
  disabled?: boolean;
  professor_uuid: string;
  onRefresh?: () => void;
}

export interface VerifyInfoDialogProps {
  data: Appointment | undefined;
  professorName: string;
}

export interface BuildingComponentProps {
  folder: string;
  className: string;
  getFolder: (folder: string) => void;
  getFloor: (floor: string) => void;
  setIsFloorSelected: (e: boolean) => void;
  disabled?: boolean;
}

export interface BuildingInfo {
  building_name: string;
  image_files: string[];
}

export interface HighlightsProps {
  className?: string;
  getFolder: (folder: string) => void;
  getFloor: (floor: string) => void;
  setIsFloorSelected: (e: boolean) => void;
}

export interface FAQid {
  id: number;
}

export interface CopyButtonProps {
  text: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  onCopy?: () => void;
}

export interface UserFAQType {
  id: number;
  query: string;
}
