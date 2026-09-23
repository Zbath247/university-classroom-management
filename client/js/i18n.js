// client/js/i18n.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Comprehensive Dual-Language Internationalization (Khmer 🇰🇭 / English 🇬🇧)
//          Digital University of Cambodia · University Classroom Management System
// ─────────────────────────────────────────────────────────────────────────────

(function (window) {
  'use strict';

  // Strict isolation: Never run i18n on login page
  if (window.location.pathname.endsWith('login.html') ||
      window.location.pathname.endsWith('login') ||
      document.querySelector('.login-container') ||
      document.querySelector('#login-card')) {
    return;
  }

  const STORAGE_KEY = 'duc_lang';
  const DEFAULT_LANG = 'km'; // Default to Khmer

  const TRANSLATIONS = {
    km: {
      // University & Brand
      'univ.name': 'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា',
      'univ.sub': 'Digital University of Cambodia',
      'univ.academic_office': 'ការិយាល័យសិក្សា',
      'gov.cambodia': 'ព្រះរាជាណាចក្រកម្ពុជា',
      'gov.motto': 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
      'system.title': 'ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀន',
      'system.short_title': 'DUC Classroom',
      'admin.panel': 'ផ្ទាំងគ្រប់គ្រងទូទៅ (Admin)',
      'teacher.panel': 'ផ្ទាំងសាស្ត្រាចារ្យ (Teacher)',
      'student.portal': 'ផតថលនិស្សិត (Student)',
      'class.cohort': 'ថ្នាក់: G1-NW-B · ជំនាន់ទី ១',
      'class.cohort_badge': 'ថ្នាក់ G1-NW-B',
      'footer.rights': 'រក្សាសិទ្ធិគ្រប់យ៉ាង © 2026',

      // Navigation
      'nav.main': 'ទំព័រចម្បង',
      'nav.management': 'ការគ្រប់គ្រងទិន្នន័យ',
      'nav.academic': 'ការសិក្សា & បង្រៀន',
      'nav.teaching': 'ការបង្រៀន',
      'nav.system': 'ប្រព័ន្ធ',
      'nav.dashboard': 'ផ្ទាំងព័ត៌មាន',
      'nav.students': 'បញ្ជីនិស្សិត',
      'nav.teachers': 'បញ្ជីសាស្ត្រាចារ្យ',
      'nav.classes': 'បន្ទប់ & ថ្នាក់រៀន',
      'nav.subjects': 'មុខវិជ្ជាសិក្សា',
      'nav.schedules': 'កាលវិភាគសិក្សា',
      'nav.attendance': 'កត់ត្រាវត្តមាន',
      'nav.assignments': 'កិច្ចការ & លំហាត់',
      'nav.resources': 'ឯកសារមេរៀន',
      'nav.profile': 'ព័ត៌មានផ្ទាល់ខ្លួន',
      'nav.signout': 'ចាកចេញពីប្រព័ន្ធ',
      'nav.logout': 'ចាកចេញ',

      // Common Actions & Buttons
      'action.add': 'បន្ថែមថ្មី',
      'action.create': 'បង្កើតថ្មី',
      'action.edit': 'កែប្រែ',
      'action.update': 'ធ្វើបច្ចុប្បន្នភាព',
      'action.delete': 'លុបចេញ',
      'action.save': 'រក្សាទុក',
      'action.cancel': 'បោះបង់',
      'action.close': 'បិទ',
      'action.search': 'ស្វែងរក',
      'action.search_dots': 'ស្វែងរក...',
      'action.filter': 'ចម្រាញ់',
      'action.reset': 'កំណត់ឡើងវិញ',
      'action.export': 'ទាញយកទិន្នន័យ',
      'action.export_excel': 'នាំចេញ Excel',
      'action.print': 'បោះពុម្ព',
      'action.refresh': 'ផ្ទុកឡើងវិញ',
      'action.view': 'មើលលម្អិត',
      'action.download': 'ទាញយក',
      'action.upload': 'បញ្ចូលឯកសារ',
      'action.submit': 'ដាក់ស្នើ',
      'action.confirm': 'យល់ព្រម',
      'action.back': 'ត្រឡប់ក្រោយ',
      'action.view_all': 'មើលទាំងអស់',
      'action.all_schedules': 'កាលវិភាគទាំងអស់',
      'action.manage_classes': 'គ្រប់គ្រងថ្នាក់រៀន',
      'action.open_link': 'បើកតំណភ្ជាប់',
      'action.save_attendance': 'រក្សាទុកវត្តមាន',
      'action.mark_all_present': 'កត់មានវត្តមានទាំងអស់',
      'action.mark_all_absent': 'កត់អវត្តមានទាំងអស់',
      'action.load_roster': 'ទាញយកបញ្ជីវត្តមាន',
      'action.take_attendance': 'កត់ត្រាវត្តមាន',
      'action.new_assignment': 'កិច្ចការថ្មី',
      'action.share_resource': 'ចែករំលែកឯកសារ',
      'action.weekly_view': 'មើលប្រចាំសប្តាហ៍',
      'action.full_schedule': 'កាលវិភាគពេញលេញ',
      'action.my_attendance': 'វត្តមានរបស់ខ្ញុំ',
      'action.study_files': 'ឯកសារមេរៀន',

      // Specific Add Buttons
      'btn.add_student': 'បន្ថែមនិស្សិត',
      'btn.add_new_student': 'បន្ថែមនិស្សិតថ្មី',
      'btn.add_teacher': 'បន្ថែមសាស្ត្រាចារ្យ',
      'btn.add_new_teacher': 'បន្ថែមសាស្ត្រាចារ្យថ្មី',
      'btn.add_class': 'បន្ថែមថ្នាក់រៀន',
      'btn.add_new_class': 'បន្ថែមថ្នាក់រៀនថ្មី',
      'btn.add_subject': 'បន្ថែមមុខវិជ្ជា',
      'btn.add_new_subject': 'បន្ថែមមុខវិជ្ជាថ្មី',
      'btn.add_schedule': 'បន្ថែមកាលវិភាគ',
      'btn.add_new_schedule': 'បន្ថែមកាលវិភាគថ្មី',
      'btn.add_assignment': 'បន្ថែមកិច្ចការ',
      'btn.new_assignment': 'កិច្ចការថ្មី',
      'btn.add_resource': 'បញ្ចូលឯកសារថ្មី',
      'btn.timetable': 'កាលវិភាគ',
      'btn.save_student': 'រក្សាទុកនិស្សិត',
      'btn.save_teacher': 'រក្សាទុកសាស្ត្រាចារ្យ',
      'btn.save_class': 'រក្សាទុកថ្នាក់រៀន',
      'btn.save_subject': 'រក្សាទុកមុខវិជ្ជា',
      'btn.save_schedule': 'រក្សាទុកកាលវិភាគ',
      'btn.save_changes': 'រក្សាទុកការកែប្រែ',
      'btn.save_assignment': 'រក្សាទុកកិច្ចការ',
      'btn.save_resource': 'រក្សាទុកឯកសារ',

      // Filter Options
      'filter.all_classes': 'ថ្នាក់ទាំងអស់',
      'filter.all_subjects': 'មុខវិជ្ជាទាំងអស់',
      'filter.all_days': 'គ្រប់ថ្ងៃទាំងអស់',
      'filter.all_types': 'គ្រប់ប្រភេទ',
      'filter.select_class': '-- ជ្រើសរើសថ្នាក់ --',
      'filter.select_subject': '-- ជ្រើសរើសមុខវិជ្ជា --',

      // Dashboard Stats Cards
      'stat.total_students': 'និស្សិតសរុប',
      'stat.total_teachers': 'សាស្ត្រាចារ្យសរុប',
      'stat.total_classes': 'ថ្នាក់រៀនសរុប',
      'stat.total_subjects': 'មុខវិជ្ជាសរុប',
      'stat.active_schedules': 'កាលវិភាគសកម្ម',
      'stat.my_classes': 'ថ្នាក់បង្រៀនរបស់ខ្ញុំ',
      'stat.my_class': 'ថ្នាក់សិក្សារបស់ខ្ញុំ',
      'stat.assigned_classes': 'ថ្នាក់បង្រៀនដែលបានចាត់តាំង',
      'stat.today_sessions': 'ម៉ោងបង្រៀនថ្ងៃនេះ',
      'stat.today_classes': 'ថ្នាក់រៀនថ្ងៃនេះ',
      'stat.total_assignments': 'កិច្ចការសរុប',
      'stat.shared_resources': 'ឯកសារបានចែករំលែក',
      'stat.pending_tasks': 'កិច្ចការរង់ចាំ',
      'stat.attendance_rate': 'អត្រាវត្តមានមធ្យម',
      'stat.enrolled_subjects': 'មុខវិជ្ជាកំពុងរៀន',
      'stat.completed_assignments': 'កិច្ចការបានបញ្ចប់',
      'stat.class_assignments': 'កិច្ចការថ្នាក់រៀន',

      // Common Table Headers & Labels
      'table.id': 'ល.រ',
      'table.code': 'កូដសម្គាល់',
      'table.name': 'ឈ្មោះពេញ',
      'table.name_en': 'ឈ្មោះពេញ (អង់គ្លេស)',
      'table.name_kh': 'ឈ្មោះពេញ (ខ្មែរ)',
      'table.student_id': 'អត្តលេខនិស្សិត',
      'table.teacher_id': 'អត្តលេខសាស្ត្រាចារ្យ',
      'table.gender': 'ភេទ',
      'table.gender_m': 'ប្រុស',
      'table.gender_f': 'ស្រី',
      'table.gender_other': 'ផ្សេងៗ',
      'table.phone': 'លេខទូរស័ព្ទ',
      'table.email': 'អ៊ីមែល',
      'table.class': 'ថ្នាក់រៀន',
      'table.class_code': 'កូដថ្នាក់',
      'table.class_name': 'ឈ្មោះថ្នាក់',
      'table.subject': 'មុខវិជ្ជា',
      'table.subject_code': 'កូដមុខវិជ្ជា',
      'table.subject_name': 'ឈ្មោះមុខវិជ្ជា',
      'table.teacher': 'សាស្ត្រាចារ្យ',
      'table.room': 'បន្ទប់រៀន',
      'table.day': 'ថ្ងៃ',
      'table.day_of_week': 'ថ្ងៃនៃសប្តាហ៍',
      'table.time': 'ពេលវេលា',
      'table.start_time': 'ម៉ោងចាប់ផ្ដើម',
      'table.end_time': 'ម៉ោងបញ្ចប់',
      'table.status': 'ស្ថានភាព',
      'table.actions': 'សកម្មភាព',
      'table.date': 'កាលបរិច្ឆេទ',
      'table.due_date': 'ថ្ងៃផុតកំណត់',
      'table.created_at': 'កាលបរិច្ឆេទបង្កើត',
      'table.title': 'ចំណងជើង',
      'table.description': 'ការពិពណ៌នា',
      'table.score': 'ពិន្ទុ',
      'table.grade': 'និទ្ទេស',
      'table.shift': 'វេនសិក្សា',
      'table.department': 'ដេប៉ាតឺម៉ង់',
      'table.specialization': 'ជំនាញឯកទេស',
      'table.academic_year': 'ឆ្នាំសិក្សា',
      'table.students_enrolled': 'ចំនួននិស្សិត',
      'table.credits': 'ក្រេឌីត',
      'table.capacity': 'ចំណុះ',
      'table.remark': 'ចំណាំ / មតិយោបល់',
      'table.time_day': 'ម៉ោង \\ ថ្ងៃ',
      'table.class_room': 'ថ្នាក់ / បន្ទប់',
      'table.instructor': 'គ្រូបង្រៀន',
      'table.type': 'ប្រភេទ',
      'table.file_url': 'ឯកសារ / តំណភ្ជាប់',
      'table.dob': 'ថ្ងៃខែឆ្នាំកំណើត',
      'table.password': 'ពាក្យសម្ងាត់',

      // Attendance & Status Badges
      'status.present': 'មានវត្តមាន',
      'status.absent': 'អវត្តមាន',
      'status.permission': 'ច្បាប់',
      'status.late': 'មកយឺត',
      'status.active': 'សកម្ម',
      'status.inactive': 'អសកម្ម',
      'status.pending': 'រង់ចាំ',
      'status.submitted': 'បានដាក់ស្នើ',
      'status.graded': 'បានដាក់ពិន្ទុ',
      'status.unassigned': 'មិនទាន់ចាត់ថ្នាក់',
      'status.tbd': 'រង់ចាំកំណត់',

      // Days of the Week
      'day.monday': 'ច័ន្ទ',
      'day.tuesday': 'អង្គារ',
      'day.wednesday': 'ពុធ',
      'day.thursday': 'ព្រហស្បតិ៍',
      'day.friday': 'សុក្រ',
      'day.saturday': 'សៅរ៍',
      'day.sunday': 'អាទិត្យ',

      // Official Timetable Document Texts
      'timetable.doc_title': 'កាលវិភាគសិក្សា ឆ្នាំទី៤ ឆមាសទី១ ជំនាន់ទី១',
      'timetable.major': 'កម្រិតបរិញ្ញាបត្រ ជំនាញ បណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព',
      'timetable.duration': 'ចាប់ផ្ដើមពីថ្ងៃទី៤ ខែកញ្ញា ឆ្នាំ២០២៦ បញ្ចប់ថ្ងៃទី២៧ ខែធ្នូ ឆ្នាំ២០២៦',
      'timetable.exam_notice': '⚠️ បញ្ជាក់៖ ការប្រឡងពាក់កណ្ដាលឆមាសចាប់ផ្ដើមពីថ្ងៃទី២៦ ខែតុលា ឆ្នាំ២០២៦ ដល់ថ្ងៃទី១ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
      'timetable.subjects_included': 'មុខវិជ្ជាដែលត្រូវសិក្សារួមមាន៖',
      'lecturer.chheang_vuthea': 'លោកគ្រូ ឈាង វុទ្ធី',
      'lecturer.sem_vavy': 'លោកគ្រូ សែម វ៉ាវី',
      'lecturer.phoeun_mesa': 'លោកគ្រូ ភឿន មេសា',

      // Page Titles & Headings
      'page.admin_dashboard': 'ផ្ទាំងគ្រប់គ្រងទូទៅ',
      'page.teacher_dashboard': 'ផ្ទាំងគ្រប់គ្រងសាស្ត្រាចារ្យ',
      'page.student_dashboard': 'ផ្ទាំងព័ត៌មាននិស្សិត',
      'page.schedules': 'កាលវិភាគសិក្សា & កម្មវិធីបង្រៀន',
      'page.class_timetables': 'កាលវិភាគថ្នាក់សិក្សា',
      'page.students': 'គ្រប់គ្រងព័ត៌មាននិស្សិត',
      'page.teachers': 'គ្រប់គ្រងព័ត៌មានសាស្ត្រាចារ្យ',
      'page.classes': 'គ្រប់គ្រងបន្ទប់ & ថ្នាក់រៀន',
      'page.class_groups': 'ក្រុមថ្នាក់សិក្សា',
      'page.subjects': 'គ្រប់គ្រងមុខវិជ្ជាសិក្សា',
      'page.academic_subjects': 'មុខវិជ្ជាសិក្សាទូទៅ',
      'page.attendance': 'ការគ្រប់គ្រងវត្តមាន',
      'page.record_attendance': 'កត់ត្រាវត្តមានប្រចាំថ្ងៃ',
      'page.assignments': 'កិច្ចការ & លំហាត់អនុវត្ត',
      'page.resources': 'ឯកសារមេរៀន & សៀវភៅ',
      'page.profile': 'ព័ត៌មានផ្ទាល់ខ្លួន',
      'page.my_student_profile': 'ព័ត៌មានផ្ទាល់ខ្លួនរបស់ខ្ញុំ',
      'page.my_schedule': 'កាលវិភាគរបស់ខ្ញុំ',
      'page.weekly_timetable': 'កាលវិភាគសិក្សាប្រចាំសប្តាហ៍',

      // Subtitles
      'sub.admin_dashboard': 'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា · ថ្នាក់ G1-NW-B',
      'sub.schedules': 'ចាត់ចែងសាស្ត្រាចារ្យ មុខវិជ្ជា ថ្ងៃ និងបន្ទប់សិក្សាសម្រាប់ថ្នាក់នីមួយៗ',
      'sub.timetable': 'កាលវិភាគប្រចាំសប្តាហ៍ផ្លូវការសម្រាប់ម៉ោងបង្រៀន មន្ទីរពិសោធន៍ និងបន្ទប់រៀន',
      'sub.students': 'បន្ថែម កែប្រែ ឬលុបគណនីនិស្សិត និងការចុះឈ្មោះចូលរៀន',
      'sub.teachers': 'គ្រប់គ្រងបុគ្គលិកសាស្ត្រាចារ្យ ដេប៉ាតឺម៉ង់ និងព័ត៌មានទំនាក់ទំនង',
      'sub.classes': 'គ្រប់គ្រងក្រុមនិស្សិត ថ្នាក់ជំនាន់ និងការបែងចែកបន្ទប់សិក្សា',
      'sub.subjects': 'គ្រប់គ្រងបញ្ជីមុខវិជ្ជា ចំនួនក្រេឌីត និងកម្មវិធីសិក្សា',
      'sub.attendance': 'ជ្រើសរើសថ្នាក់ និងមុខវិជ្ជាដើម្បីកត់ត្រាវត្តមាននិស្សិត',
      'sub.assignments': 'ដាក់កិច្ចការ លំហាត់ស្រាវជ្រាវ និងតាមដានការដាក់ស្នើរបស់និស្សិត',
      'sub.resources': 'ចែករំលែកឯកសារមេរៀន ស្លាយ និងសៀវភៅអេឡិចត្រូនិច',
      'sub.profile': 'ព័ត៌មានសម្គាល់ផ្ទាល់ខ្លួន និងការកំណត់សុវត្ថិភាពគណនី',
      'sub.general': 'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា · ថ្នាក់ G1-NW-B',

      // Widget Titles
      'widget.recent_students': '🎓 និស្សិតថ្មីៗ',
      'widget.today_schedule': '📅 កាលវិភាគថ្ងៃនេះ',
      'widget.today_classes': '📅 ថ្នាក់រៀនថ្ងៃនេះ',
      'widget.classes_enrollment': '🏫 ថ្នាក់រៀន & ចំនួននិស្សិតចុះឈ្មោះ',
      'widget.all_timetables': '📋 កំណត់ត្រាកាលវិភាគទាំងអស់',
      'widget.class_roster': 'បញ្ជីឈ្មោះសិស្សក្នុងថ្នាក់',
      'widget.upcoming_assignments': '📝 កិច្ចការជិតដល់ពេលកំណត់',
      'widget.student_id_card': 'កាតសម្គាល់ខ្លួននិស្សិត',
      'widget.update_contact': '⚙️ កែប្រែព័ត៌មានទំនាក់ទំនង & ពាក្យសម្ងាត់',

      // Roles & Names
      'role.admin': 'រដ្ឋបាល',
      'role.administrator': 'អ្នកគ្រប់គ្រងប្រព័ន្ធ',
      'role.teacher': 'សាស្ត្រាចារ្យ',
      'role.student': 'និស្សិត',

      // Filters & Dropdown Defaults
      'filter.all_classes': 'គ្រប់ថ្នាក់ទាំងអស់',
      'filter.all_days': 'គ្រប់ថ្ងៃទាំងអស់',
      'filter.all_shifts': 'គ្រប់វេនទាំងអស់',
      'filter.select_class': '-- ជ្រើសរើសថ្នាក់ --',
      'filter.select_subject': '-- ជ្រើសរើសមុខវិជ្ជា --',
      'filter.select_teacher': '-- ជ្រើសរើសសាស្ត្រាចារ្យ --',
      'filter.select_room': '-- ជ្រើសរើសបន្ទប់ --',

      // Shifts
      'shift.morning': 'ព្រឹក (Morning)',
      'shift.afternoon': 'រសៀល (Afternoon)',
      'shift.evening': 'យប់ (Evening)',
      'shift.weekend': 'ចុងសប្តាហ៍ (Weekend)',

      // Form Placeholders
      'placeholder.search_students': '🔍 ស្វែងរកតាមឈ្មោះ, អត្តលេខ, អ៊ីមែល...',
      'placeholder.search_teachers': '🔍 ស្វែងរកតាមឈ្មោះ, អត្តលេខ, ដេប៉ាតឺម៉ង់...',
      'placeholder.search_classes': '🔍 ស្វែងរកតាមកូដថ្នាក់, ឈ្មោះថ្នាក់...',
      'placeholder.search_subjects': '🔍 ស្វែងរកតាមកូដមុខវិជ្ជា, ឈ្មោះ...',

      // Loading & Empty Messages
      'msg.loading': 'កំពុងដំណើរការ...',
      'msg.loading_students': 'កំពុងទាញយកទិន្នន័យនិស្សិត...',
      'msg.loading_teachers': 'កំពុងទាញយកទិន្នន័យសាស្ត្រាចារ្យ...',
      'msg.loading_classes': 'កំពុងទាញយកទិន្នន័យថ្នាក់រៀន...',
      'msg.loading_subjects': 'កំពុងទាញយកទិន្នន័យមុខវិជ្ជា...',
      'msg.loading_schedules': 'កំពុងទាញយកកាលវិភាគ...',
      'msg.no_students': 'មិនមាននិស្សិតដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ។',
      'msg.no_teachers': 'មិនមានទិន្នន័យសាស្ត្រាចារ្យឡើយ។',
      'msg.no_classes': 'មិនមានថ្នាក់រៀនឡើយ។',
      'msg.no_subjects': 'មិនមានមុខវិជ្ជាឡើយ។',
      'msg.no_schedules': 'មិនទាន់មានកាលវិភាគនៅឡើយទេ។',
      'msg.select_class_subject': 'សូមជ្រើសរើសថ្នាក់ និងមុខវិជ្ជាខាងលើ។',

      'modal.confirm_title': 'ការបញ្ជាក់ច្បាស់លាស់',
      'modal.confirm_delete': 'តើអ្នកពិតជាចង់លុបទិន្នន័យនេះចេញពីប្រព័ន្ធមែនទេ?',
      'modal.success_title': 'ជោគជ័យ!',
      'modal.error_title': 'មានកំហុសកើតឡើង!',
      'modal.empty_title': 'មិនមានទិន្នន័យបង្ហាញឡើយ',
      'modal.empty_desc': 'មិនទាន់មានកំណត់ត្រាណាមួយត្រូវបានរកឃើញនៅក្នុងប្រព័ន្ធនៅឡើយទេ។',
      'modal.add_student': 'បន្ថែមនិស្សិតថ្មី',
      'modal.edit_student': 'កែប្រែព័ត៌មាននិស្សិត',
      'modal.add_teacher': 'បន្ថែមសាស្ត្រាចារ្យថ្មី',
      'modal.edit_teacher': 'កែប្រែព័ត៌មានសាស្ត្រាចារ្យ',
      'modal.add_class': 'បន្ថែមថ្នាក់រៀនថ្មី',
      'modal.edit_class': 'កែប្រែព័ត៌មានថ្នាក់រៀន',
      'modal.add_subject': 'បន្ថែមមុខវិជ្ជាថ្មី',
      'modal.edit_subject': 'កែប្រែព័ត៌មានមុខវិជ្ជា',
      'modal.add_schedule': 'បន្ថែមកាលវិភាគថ្មី',
      'modal.edit_schedule': 'កែប្រែកាលវិភាគ',
      'table.time_slot': 'ម៉ោងសិក្សា',
      'table.lecturer_teacher': 'សាស្ត្រាចារ្យ / គ្រូបង្រៀន',
      'table.room_lab': 'បន្ទប់ / មន្ទីរពិសោធន៍',
      'table.course_session_details': '📋 កំណត់ត្រាម៉ោងសិក្សាលម្អិត',
      'table.students_count': 'និស្សិត',
      'table.year_prefix': 'ឆ្នាំសិក្សា',
      'table.view_all': 'មើលទាំងអស់',
      'widget.today_teaching': '📅 កាលវិភាគបង្រៀនថ្ងៃនេះ',
      'widget.my_teaching_cohorts': '🏫 ក្រុមថ្នាក់បង្រៀនរបស់ខ្ញុំ',
      'welcome.student': 'សូមស្វាគមន៍',
      'welcome.teacher': 'សូមស្វាគមន៍',
      'sub.teacher_dashboard': 'គ្រប់គ្រងវត្តមាននិស្សិត កិច្ចការមុខវិជ្ជា និងឯកសារបង្រៀន',
      'sub.welcome_student': 'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា',
      'msg.no_today_schedules': 'មិនមានម៉ោងបង្រៀនសម្រាប់ថ្ងៃនេះទេ',
      'msg.no_assignments': 'មិនទាន់មានកិច្ចការត្រូវបានបង្កើតនៅឡើយទេ។',
      'msg.no_classes_assigned': 'មិនទាន់មានថ្នាក់បង្រៀនត្រូវបានចាត់តាំងនៅឡើយទេ។',
      'msg.no_assigned_schedules': 'មិនមានកាលវិភាគត្រូវបានចាត់តាំងសម្រាប់គណនីរបស់អ្នកឡើយ។',
      'page.teacher_schedule': 'កាលវិភាគបង្រៀនរបស់សាស្ត្រាចារ្យ',
      'page.my_weekly_schedule': 'កាលវិភាគបង្រៀនប្រចាំសប្តាហ៍របស់ខ្ញុំ',
      'sub.teacher_schedule': 'ទិដ្ឋភាពទូទៅនៃថ្នាក់បង្រៀនប្រចាំសប្តាហ៍ បន្ទប់សិក្សា និងពេលវេលា',
      'btn.take_today_attendance': 'កត់វត្តមានថ្ងៃនេះ',
      'action.record_attendance': 'កត់ត្រាវត្តមាន',
      'page.attendance_sheet': 'តារាងកត់ត្រាវត្តមាននិស្សិត',
      'table.attendance_date': 'កាលបរិច្ឆេទវត្តមាន',
      'table.enrolled': 'ចំនួននិស្សិត',
      'msg.no_enrolled_students': 'មិនមាននិស្សិតចុះឈ្មោះក្នុងថ្នាក់នេះនៅឡើយទេ។',
      'placeholder.remark': 'ចំណាំបន្ថែម (ឧទាហរណ៍៖ សុំច្បាប់ឈឺ...)',
      'btn.save_attendance_records': 'រក្សាទុកកំណត់ត្រាវត្តមាន',
      'page.course_assignments': 'កិច្ចការមុខវិជ្ជា',
      'sub.assignments_teacher': 'បង្កើត និងតាមដានកិច្ចការនិស្សិត គម្រោងស្រាវជ្រាវ និងកាលកំណត់ដាក់ស្នើ',
      'modal.create_assignment': 'បង្កើតកិច្ចការថ្មី',
      'table.assignment_title': 'ចំណងជើងកិច្ចការ',
      'table.target_class': 'ថ្នាក់គោលដៅ',
      'table.instructions_desc': 'ការណែនាំ / ការពិពណ៌នា',
      'page.materials_repo': 'ឃ្លាំងឯកសារ និងសម្ភារសិក្សា',
      'sub.resources_teacher': 'ចែករំលែកស្លាយមេរៀន វីដេអូបង្រៀន និងតំណភ្ជាប់សិក្សាជាមួយនិស្សិត',
      'modal.share_resource': 'ចែករំលែកឯកសារថ្មី',
      'table.resource_title': 'ចំណងជើងឯកសារ',
      'table.resource_type': 'ប្រភេទឯកសារ',
      'table.link_url': 'តំណភ្ជាប់ / ឯកសារ URL',
      'table.description_notes': 'ការពិពណ៌នា / ចំណាំ',
      'btn.share_resource': 'ចែករំលែកឯកសារ',
      'filter.all_types': 'គ្រប់ប្រភេទ',
      'type.documents': '📄 ឯកសារ & PDF',
      'type.videos': '🎥 វីដេអូបង្រៀន',
      'type.links': '🔗 តំណភ្ជាប់គេហទំព័រ',
      'type.other': '📁 ឯកសារផ្សេងៗ',
      'type.document_pdf': '📄 ឯកសារ / PDF',
      'type.video_recording': '🎥 វីដេអូ / កត់ត្រាមេរៀន',
      'type.url_drive': '🔗 តំណភ្ជាប់ URL / Drive Link',
      'type.slides': '📊 ស្លាយបទបង្ហាញ',
      'page.attendance_tracking': 'ការតាមដានវត្តមាន',
      'page.my_attendance_record': 'កំណត់ត្រាវត្តមានរបស់ខ្ញុំ',
      'sub.my_attendance_record': 'តាមដានការចូលរួមក្នុងថ្នាក់រៀន ភាគរយវត្តមាន និងកំណត់ត្រាម៉ោងសិក្សា',
      'stat.present_sessions': 'វត្តមានពេញលេញ',
      'stat.late_arrivals': 'មកយឺត',
      'stat.permission_leave': 'ច្បាប់អនុញ្ញាត',
      'stat.absent_unexcused': 'អវត្តមាន (គ្មានច្បាប់)',
      'stat.overall_compliance': 'អនុលោមភាពវត្តមានសរុប',
      'notice.attendance_requirement': '* តម្រូវឱ្យមានវត្តមានយ៉ាងតិច ៨០% ដើម្បីមានសិទ្ធិចូលរួមការប្រឡងបញ្ចប់ឆមាស។',
      'widget.detailed_attendance_log': '📋 កំណត់ត្រាវត្តមានលម្អិត',
      'sub.student_assignments': 'ពិនិត្យមើលកិច្ចការដែលបានចាត់តាំង លំហាត់អនុវត្ត និងកាលបរិច្ឆេទផុតកំណត់',
      'status.past_due': 'ហួសកាលកំណត់',
      'modal.assignment_details': 'ព័ត៌មានលម្អិតអំពីកិច្ចការ',
      'page.course_resources': 'ឯកសារ និងសម្ភារសិក្សាមុខវិជ្ជា',
      'page.learning_materials': 'ឯកសារមេរៀន & សម្ភារសិក្សា',
      'sub.student_resources': 'ចូលអានស្លាយមេរៀន សៀវភៅសិក្សា កូដ និងឯកសារយោងដែលចែករំលែកដោយសាស្ត្រាចារ្យ',
      'placeholder.search_resources': '🔍 ស្វែងរកឯកសារតាមចំណងជើង ឬប្រធានបទ...',
      'filter.all_resource_types': 'គ្រប់ប្រភេទឯកសារ',
      'modal.resource_details': 'ព័ត៌មានលម្អិតអំពីឯកសារ',
      'action.open_resource': 'បើកមើលឯកសារ ↗',
      'sub.student_profile': 'កំណត់ត្រាព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពគណនី',
      'table.class_cohort': 'ក្រុមថ្នាក់សិក្សា',
      'table.university_email': 'អ៊ីមែលសាកលវិទ្យាល័យ',
      'widget.update_contact_password': '⚙️ ធ្វើបច្ចុប្បន្នភាពទំនាក់ទំនង & ពាក្យសម្ងាត់',
      'form.change_password': 'ផ្លាស់ប្តូរពាក្យសម្ងាត់',
      'form.current_password': 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
      'form.new_password': 'ពាក្យសម្ងាត់ថ្មី',
      'placeholder.current_password': 'បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន',
      'placeholder.new_password': 'បញ្ចូលពាក្យសម្ងាត់ថ្មី (យ៉ាងតិច ៦ តួអក្សរ)',
      'page.class_management': 'ការគ្រប់គ្រងបន្ទប់ & ថ្នាក់រៀន',
      'sub.class_groups': 'គ្រប់គ្រងក្រុមនិស្សិត ថ្នាក់ជំនាន់ និងការបែងចែកបន្ទប់សិក្សា',
      'page.subject_management': 'ការគ្រប់គ្រងមុខវិជ្ជាសិក្សា',
      'sub.academic_subjects': 'គ្រប់គ្រងបញ្ជីមុខវិជ្ជា ចំនួនក្រេឌីត និងកម្មវិធីសិក្សា',
      'msg.no_resources': 'មិនមានឯកសារសិក្សាត្រូវបានរកឃើញទេ',
      'msg.no_resources_sub': 'មិនមានឯកសារត្រូវបានចែករំលែកដែលត្រូវគ្នានឹងលក្ខខណ្ឌរបស់អ្នកទេ',

      // Resources & Viewer
      'type.pdf': '📕 ឯកសារ PDF',
      'type.ppt': '📊 ស្លាយបទបង្ហាញ PPT',
      'type.document': '📄 ឯកសារទូទៅ',
      'type.document_pdf': '📄 ឯកសារ / PDF',
      'type.documents': '📄 ឯកសារ',
      'type.video': '🎥 វីដេអូបង្រៀន',
      'type.video_recording': '🎥 វីដេអូ / កត់ត្រាមេរៀន',
      'type.videos': '🎥 វីដេអូ',
      'type.slides': '📊 ស្លាយបទបង្ហាញ',
      'type.link': '🔗 តំណភ្ជាប់គេហទំព័រ',
      'type.links': '🔗 តំណភ្ជាប់',
      'type.url_drive': '🔗 តំណភ្ជាប់ / Drive',
      'type.other': '📁 ឯកសារផ្សេងៗ',
      'action.read_pdf': '📖 អាន PDF',
      'action.view_ppt': '📊 មើល PPT',
      'action.preview': '👁️ មើលជាមុន',
      'action.download_file': '📥 ទាញយកឯកសារ',
      'action.open_in_new_tab': '↗️ បើកផ្ទាំងថ្មី',
      'action.fullscreen': '⛶ ពេញអេក្រង់',
      'action.browse_file': 'ជ្រើសរើស File',
      'action.change_file': 'ផ្លាស់ប្តូរ File',
      'upload.choose_file': 'ជ្រើសរើសឯកសារ (PDF, PPT, PPTX)',
      'upload.drag_drop': 'ចុច ឬទម្លាក់ឯកសារមកទីនេះ (.pdf, .ppt, .pptx, .doc, .docx)',
      'upload.drag_drop_short': 'ឬទម្លាក់ File មកទីនេះ (.pdf, .ppt, .pptx)',
      'upload.click_or_drag': 'ចុចប៊ូតុងខាងលើ ឬទម្លាក់ File មកទីនេះ (.pdf, .ppt, .pptx, .doc, .docx)',
      'upload.file_ready': 'ឯកសាររួចរាល់សម្រាប់ចែករំលែក',
      'upload.selected_file': 'ឯកសារបានជ្រើស:',
      'upload.or_enter_url': 'ឬបញ្ចូលតំណភ្ជាប់ URL (Google Drive, YouTube, Web):',
      'upload.file_size_max': 'ទំហំអតិបរមា: 50MB',
      'modal.viewer_title': 'កម្មវិធីអាន និងមើលឯកសារមេរៀន',
      'modal.ppt_preview_note': 'បទបង្ហាញ PowerPoint អាចមើលបានតាមរយៈកម្មវិធី Microsoft Office Viewer ឬទាញយកមកបើកផ្ទាល់។',
      'modal.share_resource': 'ចែករំលែកឯកសារថ្មី',


      // Profile Avatar
      'profile.photo': 'រូបថតផ្ទាល់ខ្លួន',
      'profile.change_photo': 'ប្តូររូបថត',
      'profile.upload_photo': 'បង្ហោះរូបថតថ្មី',
      'profile.choose_photo': 'ជ្រើសរើសរូបថត',
      'profile.photo_hint': 'ទំហំអតិបរមា 5MB (JPG, PNG, WebP, GIF)',
      'profile.photo_success': 'រូបថតផ្ទាល់ខ្លួនត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!',
      'profile.photo_drop': 'ទម្លាក់រូបភាពទីនេះ ឬចុចដើម្បីជ្រើសរើស',
      'profile.delete_photo': 'លុបរូបថត',
      'profile.delete_confirm': 'តើអ្នកប្រាកដជាចង់លុបរូបថតផ្ទាល់ខ្លួននេះមែនទេ?',
      'profile.delete_success': 'រូបថតផ្ទាល់ខ្លួនត្រូវបានលុបចេញដោយជោគជ័យ!',

      // Theme
      'theme.dark': 'របៀបងងឹត',
      'theme.light': 'របៀបភ្លឺ',
      'lang.khmer': 'ភាសាខ្មែរ',
      'lang.english': 'English'
    },

    en: {
      // University & Brand
      'univ.name': 'Digital University of Cambodia',
      'univ.sub': 'Digital University of Cambodia',
      'univ.academic_office': 'Academic Affairs Office',
      'gov.cambodia': 'Kingdom of Cambodia',
      'gov.motto': 'Nation Religion King',
      'system.title': 'Classroom Management System',
      'system.short_title': 'DUC Classroom',
      'admin.panel': 'Admin Dashboard',
      'teacher.panel': 'Teacher Portal',
      'student.portal': 'Student Portal',
      'class.cohort': 'Class: G1-NW-B · Cohort 1',
      'class.cohort_badge': 'Class G1-NW-B',
      'footer.rights': 'All Rights Reserved © 2026',

      // Navigation
      'nav.main': 'Main',
      'nav.management': 'Management',
      'nav.academic': 'Academic & Teaching',
      'nav.teaching': 'Teaching',
      'nav.system': 'System',
      'nav.dashboard': 'Dashboard',
      'nav.students': 'Students',
      'nav.teachers': 'Teachers',
      'nav.classes': 'Classes',
      'nav.subjects': 'Subjects',
      'nav.schedules': 'Schedules',
      'nav.attendance': 'Attendance',
      'nav.assignments': 'Assignments',
      'nav.resources': 'Resources',
      'nav.profile': 'My Profile',
      'nav.signout': 'Sign Out',
      'nav.logout': 'Logout',

      // Common Actions & Buttons
      'action.add': 'Add New',
      'action.create': 'Create New',
      'action.edit': 'Edit',
      'action.update': 'Update',
      'action.delete': 'Delete',
      'action.save': 'Save Changes',
      'action.cancel': 'Cancel',
      'action.close': 'Close',
      'action.search': 'Search',
      'action.search_dots': 'Search...',
      'action.filter': 'Filter',
      'action.reset': 'Reset',
      'action.export': 'Export Data',
      'action.export_excel': 'Export to Excel',
      'action.print': 'Print',
      'action.refresh': 'Refresh',
      'action.view': 'View Details',
      'action.download': 'Download',
      'action.upload': 'Upload File',
      'action.submit': 'Submit',
      'action.confirm': 'Confirm',
      'action.back': 'Back',
      'action.view_all': 'View All',
      'action.all_schedules': 'All Schedules',
      'action.manage_classes': 'Manage Classes',
      'action.open_link': 'Open Link',
      'action.save_attendance': 'Save Attendance',
      'action.mark_all_present': 'Mark All Present',
      'action.mark_all_absent': 'Mark All Absent',
      'action.load_roster': 'Load Roster',
      'action.take_attendance': 'Take Attendance',
      'action.new_assignment': 'New Assignment',
      'action.share_resource': 'Share Resource',
      'action.weekly_view': 'Weekly View',
      'action.full_schedule': 'Full Schedule',
      'action.my_attendance': 'My Attendance',
      'action.study_files': 'Study Files',

      // Specific Add Buttons
      'btn.add_student': 'Add Student',
      'btn.add_new_student': 'Add New Student',
      'btn.add_teacher': 'Add Teacher',
      'btn.add_new_teacher': 'Add New Teacher',
      'btn.add_class': 'Add Class',
      'btn.add_new_class': 'Add New Class',
      'btn.add_subject': 'Add Subject',
      'btn.add_new_subject': 'Add New Subject',
      'btn.add_schedule': 'Add Schedule',
      'btn.add_new_schedule': 'Add New Schedule',
      'btn.add_assignment': 'Add Assignment',
      'btn.new_assignment': 'New Assignment',
      'btn.add_resource': 'Upload Resource',
      'btn.timetable': 'Timetable',
      'btn.save_student': 'Save Student',
      'btn.save_teacher': 'Save Teacher',
      'btn.save_class': 'Save Class',
      'btn.save_subject': 'Save Subject',
      'btn.save_schedule': 'Save Schedule',
      'btn.save_changes': 'Save Changes',
      'btn.save_assignment': 'Save Assignment',
      'btn.save_resource': 'Save Resource',

      // Filter Options
      'filter.all_classes': 'All Classes',
      'filter.all_subjects': 'All Subjects',
      'filter.all_days': 'All Days',
      'filter.all_types': 'All Types',
      'filter.select_class': '-- Select Class --',
      'filter.select_subject': '-- Select Subject --',

      // Dashboard Stats Cards
      'stat.total_students': 'Total Students',
      'stat.total_teachers': 'Total Teachers',
      'stat.total_classes': 'Total Classes',
      'stat.total_subjects': 'Total Subjects',
      'stat.active_schedules': 'Active Schedules',
      'stat.my_classes': 'My Classes',
      'stat.my_class': 'My Class',
      'stat.assigned_classes': 'Assigned Classes',
      'stat.today_sessions': 'Today Sessions',
      'stat.today_classes': "Today's Classes",
      'stat.total_assignments': 'Total Assignments',
      'stat.shared_resources': 'Shared Resources',
      'stat.pending_tasks': 'Pending Tasks',
      'stat.attendance_rate': 'Avg Attendance Rate',
      'stat.enrolled_subjects': 'Enrolled Subjects',
      'stat.completed_assignments': 'Completed Tasks',
      'stat.class_assignments': 'Class Assignments',

      // Common Table Headers & Labels
      'table.id': 'No.',
      'table.code': 'Code',
      'table.name': 'Full Name',
      'table.name_en': 'Full Name (English)',
      'table.name_kh': 'Full Name (Khmer)',
      'table.student_id': 'Student ID',
      'table.teacher_id': 'Teacher ID',
      'table.gender': 'Gender',
      'table.gender_m': 'Male',
      'table.gender_f': 'Female',
      'table.gender_other': 'Other',
      'table.phone': 'Phone Number',
      'table.email': 'Email Address',
      'table.class': 'Class',
      'table.class_code': 'Class Code',
      'table.class_name': 'Class Name',
      'table.subject': 'Subject',
      'table.subject_code': 'Subject Code',
      'table.subject_name': 'Subject Name',
      'table.teacher': 'Teacher / Lecturer',
      'table.room': 'Room',
      'table.day': 'Day',
      'table.day_of_week': 'Day of Week',
      'table.time': 'Time',
      'table.start_time': 'Start Time',
      'table.end_time': 'End Time',
      'table.status': 'Status',
      'table.actions': 'Actions',
      'table.date': 'Date',
      'table.due_date': 'Due Date',
      'table.created_at': 'Created At',
      'table.title': 'Title',
      'table.description': 'Description',
      'table.score': 'Score',
      'table.grade': 'Grade',
      'table.shift': 'Shift',
      'table.department': 'Department',
      'table.specialization': 'Specialization',
      'table.academic_year': 'Academic Year',
      'table.students_enrolled': 'Students Enrolled',
      'table.credits': 'Credits',
      'table.capacity': 'Capacity',
      'table.remark': 'Remark / Note',
      'table.time_day': 'Time \\ Day',
      'table.class_room': 'Class / Room',
      'table.instructor': 'Instructor',
      'table.type': 'Type',
      'table.file_url': 'File / URL',
      'table.dob': 'Date of Birth',
      'table.password': 'Account Password',

      // Attendance & Status Badges
      'status.present': 'Present',
      'status.absent': 'Absent',
      'status.permission': 'Permission',
      'status.late': 'Late',
      'status.active': 'Active',
      'status.inactive': 'Inactive',
      'status.pending': 'Pending',
      'status.submitted': 'Submitted',
      'status.graded': 'Graded',
      'status.unassigned': 'Unassigned',
      'status.tbd': 'TBD',

      // Days of the Week
      'day.monday': 'Monday',
      'day.tuesday': 'Tuesday',
      'day.wednesday': 'Wednesday',
      'day.thursday': 'Thursday',
      'day.friday': 'Friday',
      'day.saturday': 'Saturday',
      'day.sunday': 'Sunday',

      // Official Timetable Document Texts
      'timetable.doc_title': 'Class Timetable · Year 4, Semester 1, Cohort 1',
      'timetable.major': "Bachelor's Degree · Computer Networks & Cyber Security",
      'timetable.duration': 'From September 4, 2026 to December 27, 2026',
      'timetable.exam_notice': '⚠️ Note: Midterm examinations start from October 26, 2026 to November 1, 2026',
      'timetable.subjects_included': 'Enrolled subjects include:',
      'lecturer.chheang_vuthea': 'Lecturer Chheang Vuthea',
      'lecturer.sem_vavy': 'Lecturer Sem Vavy',
      'lecturer.phoeun_mesa': 'Lecturer Phoeun Mesa',

      // Page Titles & Headings
      'page.admin_dashboard': 'Admin Dashboard',
      'page.teacher_dashboard': 'Teacher Dashboard',
      'page.student_dashboard': 'Student Dashboard',
      'page.schedules': 'Class Schedules & Timetable',
      'page.class_timetables': 'Class Timetables',
      'page.students': 'Student Management',
      'page.teachers': 'Teacher Management',
      'page.classes': 'Class Management',
      'page.class_groups': 'Class Groups',
      'page.subjects': 'Subject Management',
      'page.academic_subjects': 'Academic Subjects',
      'page.attendance': 'Attendance Management',
      'page.record_attendance': 'Record Daily Attendance',
      'page.assignments': 'Assignments & Homework',
      'page.resources': 'Learning Resources',
      'page.profile': 'My Profile',
      'page.my_student_profile': 'My Student Profile',
      'page.my_schedule': 'My Schedule',
      'page.weekly_timetable': 'Weekly Class Timetable',

      // Subtitles
      'sub.admin_dashboard': 'Digital University of Cambodia · Class G1-NW-B',
      'sub.schedules': 'Assign teachers, subjects, days, and classrooms to each class cohort',
      'sub.timetable': 'Your official weekly schedule for lectures, labs, and classrooms',
      'sub.students': 'Add, update, or remove student accounts and enrollment',
      'sub.teachers': 'Manage university faculty members, departments, and credentials',
      'sub.classes': 'Manage university student cohorts, sections, and academic cohorts',
      'sub.subjects': 'Manage course catalog, credit allocations, and subject outlines',
      'sub.attendance': 'Select class and subject to load the roster, mark statuses, and save in one click',
      'sub.assignments': 'Create assignments, track submissions, and evaluate student work',
      'sub.resources': 'Share course lecture slides, textbooks, and class documents',
      'sub.profile': 'Personal identity records and account security settings',
      'sub.general': 'Digital University of Cambodia · Class G1-NW-B',

      // Widget Titles
      'widget.recent_students': '🎓 Recent Students',
      'widget.today_schedule': "📅 Today's Schedule",
      'widget.today_classes': "📅 Today's Classes",
      'widget.classes_enrollment': '🏫 Classes & Student Enrollment',
      'widget.all_timetables': '📋 All Timetable Records',
      'widget.class_roster': 'Class Roster',
      'widget.upcoming_assignments': '📝 Upcoming Assignments',
      'widget.student_id_card': 'Student Identity Card',
      'widget.update_contact': '⚙️ Update Contact & Password',

      // Roles & Names
      'role.admin': 'Admin',
      'role.administrator': 'Administrator',
      'role.teacher': 'Teacher',
      'role.student': 'Student',

      // Filters & Dropdown Defaults
      'filter.all_classes': 'All Classes',
      'filter.all_days': 'All Days',
      'filter.all_shifts': 'All Shifts',
      'filter.select_class': '-- Select Class --',
      'filter.select_subject': '-- Select Subject --',
      'filter.select_teacher': '-- Select Teacher --',
      'filter.select_room': '-- Select Room --',

      // Shifts
      'shift.morning': 'Morning Shift',
      'shift.afternoon': 'Afternoon Shift',
      'shift.evening': 'Evening Shift',
      'shift.weekend': 'Weekend Shift',

      // Form Placeholders
      'placeholder.search_students': '🔍 Search by name, student ID, email...',
      'placeholder.search_teachers': '🔍 Search teachers by name, ID, department...',
      'placeholder.search_classes': '🔍 Search classes by code, name...',
      'placeholder.search_subjects': '🔍 Search subjects by code, name...',

      // Loading & Empty Messages
      'msg.loading': 'Loading...',
      'msg.loading_students': 'Loading students...',
      'msg.loading_teachers': 'Loading teachers...',
      'msg.loading_classes': 'Loading classes...',
      'msg.loading_subjects': 'Loading subjects...',
      'msg.loading_schedules': 'Loading schedules...',
      'msg.no_students': 'No students found matching your criteria.',
      'msg.no_teachers': 'No teachers found.',
      'msg.no_classes': 'No classes found.',
      'msg.no_subjects': 'No subjects found.',
      'msg.no_schedules': 'No schedules found.',
      'msg.select_class_subject': 'Please select class and subject above.',

      'modal.confirm_title': 'Confirm Action',
      'modal.confirm_delete': 'Are you sure you want to delete this record?',
      'modal.success_title': 'Success!',
      'modal.error_title': 'An error occurred!',
      'modal.empty_title': 'No records found',
      'modal.empty_desc': 'There are no items matching this criteria at this time.',
      'modal.add_student': 'Add New Student',
      'modal.edit_student': 'Edit Student',
      'modal.add_teacher': 'Add New Teacher',
      'modal.edit_teacher': 'Edit Teacher',
      'modal.add_class': 'Add New Class',
      'modal.edit_class': 'Edit Class',
      'modal.add_subject': 'Add New Subject',
      'modal.edit_subject': 'Edit Subject',
      'modal.add_schedule': 'Add New Schedule',
      'modal.edit_schedule': 'Edit Schedule',
      'table.time_slot': 'Time Slot',
      'table.lecturer_teacher': 'Lecturer / Teacher',
      'table.room_lab': 'Room / Lab',
      'table.course_session_details': '📋 Course Session Details',
      'table.students_count': 'Students',
      'table.year_prefix': 'Year',
      'table.view_all': 'View All',
      'widget.today_teaching': "📅 Today's Teaching Schedule",
      'widget.my_teaching_cohorts': '🏫 My Teaching Cohorts',
      'welcome.student': 'Welcome',
      'welcome.teacher': 'Welcome',
      'sub.teacher_dashboard': 'Manage student attendance, course assignments, and learning materials',
      'sub.welcome_student': 'Digital University of Cambodia',
      'msg.no_today_schedules': 'No classes scheduled for today',
      'msg.no_assignments': 'No assignments created yet.',
      'msg.no_classes_assigned': 'No classes assigned.',
      'msg.no_assigned_schedules': 'No schedules assigned to your account.',
      'page.teacher_schedule': 'Teacher Teaching Timetable',
      'page.my_weekly_schedule': 'My Weekly Schedule',
      'sub.teacher_schedule': 'Overview of your weekly classes, assigned classrooms, and timing',
      'btn.take_today_attendance': "Take Today's Attendance",
      'action.record_attendance': 'Record Attendance',
      'page.attendance_sheet': 'Student Attendance Sheet',
      'table.attendance_date': 'Attendance Date',
      'table.enrolled': 'Enrolled',
      'msg.no_enrolled_students': 'No students enrolled in this class.',
      'placeholder.remark': 'Optional remark (e.g. sick note)',
      'btn.save_attendance_records': 'Save Attendance Records',
      'page.course_assignments': 'Course Assignments',
      'sub.assignments_teacher': 'Create and track student coursework, projects, and submission deadlines',
      'modal.create_assignment': 'Create New Assignment',
      'table.assignment_title': 'Assignment Title',
      'table.target_class': 'Target Class',
      'table.instructions_desc': 'Instructions / Description',
      'page.materials_repo': 'Learning Materials Repository',
      'sub.resources_teacher': 'Share lecture notes, slides, video recordings, and study links with students',
      'modal.share_resource': 'Share New Resource',
      'table.resource_title': 'Resource Title',
      'table.resource_type': 'Resource Type',
      'table.link_url': 'Link / File URL',
      'table.description_notes': 'Description / Notes',
      'btn.share_resource': 'Share Resource',
      'filter.all_types': 'All Types',
      'type.documents': '📄 Documents & PDFs',
      'type.videos': '🎥 Video Lessons',
      'type.links': '🔗 Web Links',
      'type.other': '📁 Other Files',
      'type.document_pdf': '📄 Document / PDF',
      'type.video_recording': '🎥 Video / Lecture Recording',
      'type.url_drive': '🔗 Web URL / Drive Link',
      'type.slides': '📊 Slide Presentations',
      'page.attendance_tracking': 'Attendance Tracking',
      'page.my_attendance_record': 'My Attendance Record',
      'sub.my_attendance_record': 'Track your classroom participation, attendance percentage, and session records',
      'stat.present_sessions': 'Present Sessions',
      'stat.late_arrivals': 'Late Arrivals',
      'stat.permission_leave': 'Permission / Leave',
      'stat.absent_unexcused': 'Absent (Unexcused)',
      'stat.overall_compliance': 'Overall Attendance Compliance',
      'notice.attendance_requirement': '* A minimum of 80% attendance is required to qualify for end-of-semester final examinations.',
      'widget.detailed_attendance_log': '📋 Detailed Attendance Log',
      'sub.student_assignments': 'View assigned coursework, laboratory exercises, and submission deadlines',
      'status.past_due': 'Past Due',
      'modal.assignment_details': 'Assignment Details',
      'page.course_resources': 'Course Learning Resources',
      'page.learning_materials': 'Learning Materials & Resources',
      'sub.student_resources': 'Access lecture slides, textbooks, code repositories, and references shared by your instructors',
      'placeholder.search_resources': '🔍 Search materials by title or topic...',
      'filter.all_resource_types': 'All Resource Types',
      'modal.resource_details': 'Resource Details',
      'action.open_resource': 'Open Resource ↗',
      'sub.student_profile': 'Personal identity records and account security settings',
      'table.class_cohort': 'Class Cohort',
      'table.university_email': 'University Email',
      'widget.update_contact_password': '⚙️ Update Contact & Password',
      'form.change_password': 'Change Password',
      'form.current_password': 'Current Password',
      'form.new_password': 'New Password',
      'placeholder.current_password': 'Enter current password',
      'placeholder.new_password': 'Enter new password (min 6 chars)',
      'page.class_management': 'Class Management',
      'sub.class_groups': 'Manage university student cohorts, sections, and academic cohorts',
      'page.subject_management': 'Subject Management',
      'sub.academic_subjects': 'Manage course catalog, credit allocations, and subject outlines',
      'msg.no_resources': 'No learning resources found',
      'msg.no_resources_sub': 'No materials have been shared matching your filter criteria.',

      // Resources & Viewer
      'type.pdf': '📕 PDF Document',
      'type.ppt': '📊 PowerPoint Slides',
      'type.document': '📄 General Document',
      'type.document_pdf': '📄 Document / PDF',
      'type.documents': '📄 Documents',
      'type.video': '🎥 Video Lesson',
      'type.video_recording': '🎥 Video / Lecture Recording',
      'type.videos': '🎥 Videos',
      'type.slides': '📊 Presentation Slides',
      'type.link': '🔗 Web Link',
      'type.links': '🔗 Links',
      'type.url_drive': '🔗 Web URL / Drive Link',
      'type.other': '📁 Other Files',
      'action.read_pdf': '📖 Read PDF',
      'action.view_ppt': '📊 View PPT',
      'action.preview': '👁️ Preview',
      'action.download_file': '📥 Download File',
      'action.open_in_new_tab': '↗️ Open in New Tab',
      'action.fullscreen': '⛶ Fullscreen',
      'action.browse_file': 'Browse File',
      'action.change_file': 'Change File',
      'upload.choose_file': 'Choose File (PDF, PPT, PPTX)',
      'upload.drag_drop': 'Click or drag & drop files (.pdf, .ppt, .pptx, .doc, .docx)',
      'upload.drag_drop_short': 'or drag & drop file here (.pdf, .ppt, .pptx)',
      'upload.click_or_drag': 'Click the button above or drag & drop files here (.pdf, .ppt, .pptx, .doc, .docx)',
      'upload.file_ready': 'File ready to share',
      'upload.selected_file': 'Selected file:',
      'upload.or_enter_url': 'Or enter a link URL (Google Drive, YouTube, Web):',
      'upload.file_size_max': 'Max file size: 50MB',
      'modal.viewer_title': 'Lesson Document & Presentation Viewer',
      'modal.ppt_preview_note': 'PowerPoint presentation can be previewed online with Office Viewer or downloaded directly.',
      'modal.share_resource': 'Share New Resource',


      // Profile Avatar
      'profile.photo': 'Profile Photo',
      'profile.change_photo': 'Change Photo',
      'profile.upload_photo': 'Upload New Photo',
      'profile.choose_photo': 'Choose Photo',
      'profile.photo_hint': 'Max size 5MB (JPG, PNG, WebP, GIF)',
      'profile.photo_success': 'Profile photo updated successfully!',
      'profile.photo_drop': 'Drop image here or click to choose',
      'profile.delete_photo': 'Remove Photo',
      'profile.delete_confirm': 'Are you sure you want to remove your profile photo?',
      'profile.delete_success': 'Profile photo removed successfully!',

      // Theme
      'theme.dark': 'Dark Mode',
      'theme.light': 'Light Mode',
      'lang.khmer': 'ភាសាខ្មែរ',
      'lang.english': 'English'
    }
  };

  // Bidirectional reverse dictionary: clean phrase -> i18n key
  const PHRASE_TO_KEY = {};

  function normalize(str) {
    if (!str) return '';
    return str
      .replace(/[➕📅🚪🎓👨‍🏫🏫📚✅❌💾📋✏️🗑️👁️⚙️📝🔗✈️🔍📂⚠️*:]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Populate reverse lookup from dictionary
  ['km', 'en'].forEach(lang => {
    const dict = TRANSLATIONS[lang];
    Object.keys(dict).forEach(key => {
      const val = dict[key];
      const norm = normalize(val);
      if (norm && !PHRASE_TO_KEY[norm]) {
        PHRASE_TO_KEY[norm] = key;
      }
    });
  });

  // Additional aliases & common permutations
  const ALIASES = {
    'dashboard': 'nav.dashboard',
    'students': 'nav.students',
    'teachers': 'nav.teachers',
    'classes': 'nav.classes',
    'subjects': 'nav.subjects',
    'schedules': 'nav.schedules',
    'timetable': 'nav.schedules',
    'attendance': 'nav.attendance',
    'assignments': 'nav.assignments',
    'resources': 'nav.resources',
    'profile': 'nav.profile',
    'my profile': 'nav.profile',
    'sign out': 'nav.signout',
    'logout': 'nav.logout',
    'edit': 'action.edit',
    'delete': 'action.delete',
    'view': 'action.view',
    'view all': 'action.view_all',
    'all schedules': 'action.all_schedules',
    'manage classes': 'action.manage_classes',
    'male': 'table.gender_m',
    'female': 'table.gender_f',
    'other': 'table.gender_other',
    'active': 'status.active',
    'inactive': 'status.inactive',
    'present': 'status.present',
    'absent': 'status.absent',
    'late': 'status.late',
    'permission': 'status.permission',
    'unassigned': 'status.unassigned',
    'tbd': 'status.tbd',
    'student id': 'table.student_id',
    'teacher id': 'table.teacher_id',
    'full name': 'table.name',
    'full name (english)': 'table.name_en',
    'full name (khmer)': 'table.name_kh',
    'full name (english / khmer)': 'table.name',
    'gender': 'table.gender',
    'class': 'table.class',
    'subject': 'table.subject',
    'teacher': 'table.teacher',
    'teacher / instructor': 'table.teacher',
    'phone': 'table.phone',
    'phone number': 'table.phone',
    'email': 'table.email',
    'email address': 'table.email',
    'actions': 'table.actions',
    'room': 'table.room',
    'room / location': 'table.room',
    'room / lab': 'table.room_lab',
    'time': 'table.time',
    'time slot': 'table.time_slot',
    'time \\ day': 'table.time_day',
    'time \\\\ day': 'table.time_day',
    'time / day': 'table.time_day',
    'time day': 'table.time_day',
    'lecturer / teacher': 'table.lecturer_teacher',
    'lecturer / instructor': 'table.lecturer_teacher',
    'course session details': 'table.course_session_details',
    'take attendance': 'action.take_attendance',
    'share resource': 'action.share_resource',
    'weekly view': 'action.weekly_view',
    'full schedule': 'action.full_schedule',
    'my attendance': 'action.my_attendance',
    'study files': 'action.study_files',
    'assigned classes': 'stat.assigned_classes',
    'today classes': 'stat.today_classes',
    'total assignments': 'stat.total_assignments',
    'shared resources': 'stat.shared_resources',
    'today teaching schedule': 'widget.today_teaching',
    'teachers & instructors': 'page.teachers',
    'welcome': 'welcome.student',
    'day': 'table.day',
    'day of week': 'table.day_of_week',
    'day of the week': 'table.day_of_week',
    'date': 'table.date',
    'status': 'table.status',
    'credits': 'table.credits',
    'capacity': 'table.capacity',
    'academic year': 'table.academic_year',
    'students enrolled': 'table.students_enrolled',
    'description': 'table.description',
    'due date': 'table.due_date',
    'score': 'table.score',
    'grade': 'table.grade',
    'account password': 'table.password',
    'department': 'table.department',
    'specialization': 'table.specialization',
    'start time': 'table.start_time',
    'end time': 'table.end_time',
    'all classes': 'filter.all_classes',
    'all days': 'filter.all_days',
    'all shifts': 'filter.all_shifts',
    'select class': 'filter.select_class',
    '-- select class --': 'filter.select_class',
    'select teacher': 'filter.select_teacher',
    '-- select teacher --': 'filter.select_teacher',
    'select subject': 'filter.select_subject',
    '-- select subject --': 'filter.select_subject',
    'filter': 'action.filter',
    'reset': 'action.reset',
    'search': 'action.search',
    'cancel': 'action.cancel',
    'save student': 'btn.save_student',
    'save teacher': 'btn.save_teacher',
    'save class': 'btn.save_class',
    'save subject': 'btn.save_subject',
    'save schedule': 'btn.save_schedule',
    'save changes': 'btn.save_changes',
    'add student': 'btn.add_student',
    'add new student': 'btn.add_new_student',
    'add teacher': 'btn.add_teacher',
    'add new teacher': 'btn.add_new_teacher',
    'add class': 'btn.add_class',
    'add new class': 'btn.add_new_class',
    'add subject': 'btn.add_subject',
    'add new subject': 'btn.add_new_subject',
    'add schedule': 'btn.add_schedule',
    'add new schedule': 'btn.add_new_schedule',
    'new assignment': 'btn.new_assignment',
    'mark all present': 'action.mark_all_present',
    'mark all absent': 'action.mark_all_absent',
    'save attendance': 'action.save_attendance',
    'load roster': 'action.load_roster',
    'loading...': 'msg.loading',
    'loading students...': 'msg.loading_students',
    'loading teachers...': 'msg.loading_teachers',
    'loading classes...': 'msg.loading_classes',
    'loading subjects...': 'msg.loading_subjects',
    'loading schedules...': 'msg.loading_schedules',
    'no students found matching your criteria.': 'msg.no_students',
    'no students found.': 'msg.no_students',
    'no schedules found.': 'msg.no_schedules',
    'no teachers found.': 'msg.no_teachers',
    'no classes found.': 'msg.no_classes',
    'no subjects found.': 'msg.no_subjects',
    'no records found': 'modal.empty_title',
    'please select class and subject above.': 'msg.select_class_subject',
    'monday': 'day.monday',
    'tuesday': 'day.tuesday',
    'wednesday': 'day.wednesday',
    'thursday': 'day.thursday',
    'friday': 'day.friday',
    'saturday': 'day.saturday',
    'sunday': 'day.sunday',
    'my teaching cohorts': 'widget.my_teaching_cohorts',
    'teacher teaching timetable': 'page.teacher_schedule',
    'my weekly schedule': 'page.my_weekly_schedule',
    "take today's attendance": 'btn.take_today_attendance',
    'record attendance': 'action.record_attendance',
    'student attendance sheet': 'page.attendance_sheet',
    'class roster': 'widget.class_roster',
    'attendance date': 'table.attendance_date',
    'enrolled': 'table.enrolled',
    'save attendance records': 'btn.save_attendance_records',
    'course assignments': 'page.course_assignments',
    'create new assignment': 'modal.create_assignment',
    'assignment title': 'table.assignment_title',
    'target class': 'table.target_class',
    'instructions / description': 'table.instructions_desc',
    'learning materials repository': 'page.materials_repo',
    'share new resource': 'modal.share_resource',
    'resource title': 'table.resource_title',
    'resource type': 'table.resource_type',
    'link / file url': 'table.link_url',
    'description / notes': 'table.description_notes',
    'share resource': 'btn.share_resource',
    'all types': 'filter.all_types',
    'attendance tracking': 'page.attendance_tracking',
    'my attendance record': 'page.my_attendance_record',
    'present sessions': 'stat.present_sessions',
    'late arrivals': 'stat.late_arrivals',
    'permission / leave': 'stat.permission_leave',
    'absent (unexcused)': 'stat.absent_unexcused',
    'overall attendance compliance': 'stat.overall_compliance',
    'detailed attendance log': 'widget.detailed_attendance_log',
    'past due': 'status.past_due',
    'assignment details': 'modal.assignment_details',
    'course learning resources': 'page.course_resources',
    'learning materials & resources': 'page.learning_materials',
    'all resource types': 'filter.all_resource_types',
    'resource details': 'modal.resource_details',
    'open resource': 'action.open_resource',
    'open resource ↗': 'action.open_resource',
    'student identity card': 'widget.student_id_card',
    'class cohort': 'table.class_cohort',
    'university email': 'table.university_email',
    'update contact & password': 'widget.update_contact_password',
    'change password': 'form.change_password',
    'current password': 'form.current_password',
    'new password': 'form.new_password',
    'class management': 'page.class_management',
    'class groups': 'page.class_groups',
    'class code': 'table.class_code',
    'class name': 'table.class_name',
    'students enrolled': 'table.students_enrolled',
    'add new class': 'modal.add_class',
    'edit class': 'modal.edit_class',
    'save class': 'btn.save_class',
    'subject management': 'page.subject_management',
    'academic subjects': 'page.academic_subjects',
    'subject code': 'table.subject_code',
    'subject name': 'table.subject_name',
      'add new subject': 'modal.add_subject',
    'edit subject': 'modal.edit_subject',
    'save subject': 'btn.save_subject',
    'no learning resources found': 'msg.no_resources',
    'open material ↗': 'action.open_resource',
    'my student profile': 'nav.profile',
    'personal identity records and account security settings': 'sub.student_profile',
    'full name (english / khmer)': 'table.name'
  };

  Object.assign(PHRASE_TO_KEY, ALIASES);

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function t(key, fallback = '') {
    const lang = getCurrentLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key] !== undefined) {
      return TRANSLATIONS['en'][key];
    }
    return fallback || key;
  }

  /**
   * Applies translation to a specific element while cleanly preserving child icons and red asterisks
   */
  function applyTranslationToElement(el, key) {
    const translated = t(key);
    if (!translated) return;

    // 1. If element has designated text span
    const textSpan = el.querySelector('.nav-label, .btn-text, .i18n-text');
    if (textSpan) {
      textSpan.textContent = translated;
      return;
    }

    // 2. If element has child icons (SVG, img, etc.)
    const icon = el.querySelector('.app-svg-icon, .nav-icon, img, svg');
    if (icon) {
      const cloneIcon = icon.cloneNode(true);
      el.innerHTML = '';
      el.appendChild(cloneIcon);
      el.appendChild(document.createTextNode(' ' + translated));
      return;
    }

    // 3. If element has child elements like <span class="required">*</span>
    const requiredSpan = el.querySelector('.required');
    if (requiredSpan) {
      let foundTextNode = false;
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
          child.nodeValue = translated + ' ';
          foundTextNode = true;
          break;
        }
      }
      if (!foundTextNode) {
        el.insertBefore(document.createTextNode(translated + ' '), requiredSpan);
      }
      return;
    }

    // 4. Check for leading emoji prefix
    const currentText = el.textContent || '';
    const emojiMatch = currentText.match(/^([➕📅🚪🎓👨‍🏫🏫📚✅❌💾📋✏️🗑️👁️⚙️📝🔗✈️🔍📂⚠️]+\s*)/);
    if (emojiMatch && !translated.startsWith(emojiMatch[1].trim())) {
      el.textContent = emojiMatch[1].trim() + ' ' + translated;
    } else {
      el.textContent = translated;
    }
  }

  /**
   * Deep recursive TreeWalker to translate all text nodes throughout the page
   */
  function walkAndTranslateTextNodes(root) {
    if (!root) return;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('#sidebar-controls') || parent.closest('#login-card') || parent.classList.contains('sidebar-avatar') || parent.classList.contains('topbar-avatar')) {
            return NodeFilter.FILTER_REJECT;
          }
          const txt = node.nodeValue.trim();
          if (!txt || txt.length < 2) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    const nodesToTranslate = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      nodesToTranslate.push(currentNode);
    }

    nodesToTranslate.forEach(node => {
      const raw = node.nodeValue;
      const norm = normalize(raw);
      if (norm && PHRASE_TO_KEY[norm]) {
        const key = PHRASE_TO_KEY[norm];
        const translated = t(key);
        if (translated) {
          if (!node.parentElement.hasAttribute('data-i18n')) {
            node.parentElement.setAttribute('data-i18n', key);
          }
          const leadingSpace = raw.match(/^\s*/)[0];
          const trailingSpace = raw.match(/\s*$/)[0];
          node.nodeValue = leadingSpace + translated + trailingSpace;
        }
      }
    });
  }

  /**
   * Master function: Scans container, translates explicit data-i18n, auto-detects untagged candidates,
   * and walks all text nodes.
   */
  function autoTranslate(root = document) {
    const lang = getCurrentLang();

    // 1. Process explicit data-i18n elements
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) applyTranslationToElement(el, key);
    });

    // 2. Process explicit placeholders
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });

    // 3. Process explicit titles
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });

    // 4. Scan candidate elements (buttons, headers, form labels, badges, options, placeholders)
    const candidates = root.querySelectorAll(`
      .sidebar-section-label,
      .sidebar-nav .nav-link,
      .topbar-title,
      .topbar-user-role,
      .sidebar-user-role,
      .page-title,
      .page-subtitle,
      .card-header h1, .card-header h2, .card-header h3,
      .modal-title,
      .stat-label,
      .form-label,
      th,
      .badge,
      .empty-state-title,
      .empty-state-desc,
      button:not(.btn-lang-toggle):not(.btn-theme-toggle),
      a.btn,
      select option,
      input[placeholder]
    `);

    candidates.forEach(el => {
      if (el.tagName === 'INPUT' && el.placeholder && !el.hasAttribute('data-i18n-placeholder')) {
        const norm = normalize(el.placeholder);
        if (PHRASE_TO_KEY[norm]) {
          const key = PHRASE_TO_KEY[norm];
          el.setAttribute('data-i18n-placeholder', key);
          el.setAttribute('placeholder', t(key));
        }
        return;
      }

      if (el.hasAttribute('data-i18n')) return;

      let raw = '';
      const labelSpan = el.querySelector('.nav-label, .btn-text, .i18n-text');
      if (labelSpan) {
        raw = labelSpan.textContent;
      } else {
        raw = el.textContent;
      }

      const norm = normalize(raw);
      if (norm && PHRASE_TO_KEY[norm]) {
        const key = PHRASE_TO_KEY[norm];
        el.setAttribute('data-i18n', key);
        applyTranslationToElement(el, key);
      }
    });

    // 5. Deep text node translation across the subtree
    walkAndTranslateTextNodes(root);

    // 6. Update HTML lang & body classes
    document.documentElement.lang = lang === 'km' ? 'km' : 'en';
    if (lang === 'km') {
      document.body.classList.add('lang-km');
      document.body.classList.remove('lang-en');
    } else {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-km');
    }
  }

  function setLanguage(lang) {
    if (lang !== 'km' && lang !== 'en') lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    autoTranslate(document);

    // Broadcast change event
    window.dispatchEvent(new CustomEvent('duc:langchange', { detail: { lang } }));
  }

  // Setup lightweight debounced MutationObserver for dynamic table rows and cards
  let observerTimeout = null;
  function initObserver() {
    if (!window.MutationObserver) return;
    const target = document.getElementById('main-content') || document.body;
    if (!target) return;

    const observer = new MutationObserver(mutations => {
      let hasAdded = false;
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length > 0) {
          hasAdded = true;
          break;
        }
      }
      if (hasAdded) {
        if (observerTimeout) clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
          autoTranslate(target);
        }, 50);
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  // Global I18n Object
  window.I18n = {
    getCurrentLang,
    setLanguage,
    t,
    translateDOM: autoTranslate,
    autoTranslate,
    TRANSLATIONS,
    PHRASE_TO_KEY
  };
  if (typeof globalThis !== 'undefined') {
    globalThis.I18n = window.I18n;
  }
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      autoTranslate(document);
      initObserver();
    });
  } else {
    autoTranslate(document);
    initObserver();
  }

})(window);
