// ============================================================
// IN-CLASS COURSE SCHEDULE
// Single source for the Schedule page and the registration date picker.
// To update: edit COURSES below. A course disappears automatically
// once its last class date has passed (Bell lets students join a course
// already underway and make up missed days in a later course; Nick, Nov 19 2026).
// ============================================================

const COURSES = [
  { code: 'W26-10S', label: 'October', type: '4 Day Saturdays', sessions: [
    ['2026-10-17', '9am–3pm'], ['2026-10-24', '9am–3pm'], ['2026-10-31', '9am–3pm'], ['2026-11-07', '9am–3pm']
  ]},
  { code: 'W26-11S', label: 'November', type: '4 Day Saturdays', sessions: [
    ['2026-11-21', '9am–3pm'], ['2026-11-28', '9am–3pm'], ['2026-12-05', '9am–3pm'], ['2026-12-12', '9am–3pm']
  ]},
  { code: 'W26-12A', label: 'December — Christmas Break #1', type: '4 Day Consecutive', sessions: [
    ['2026-12-19', '10am–4pm'], ['2026-12-20', '10am–4pm'], ['2026-12-21', '10am–4pm'], ['2026-12-22', '10am–4pm']
  ]},
  { code: 'W26-12B', label: 'December — Christmas Break #2', type: '4 Day Consecutive', sessions: [
    ['2026-12-27', '10am–4pm'], ['2026-12-28', '10am–4pm'], ['2026-12-29', '10am–4pm'], ['2026-12-30', '10am–4pm']
  ]},
  { code: 'W27-02S', label: 'February', type: '4 Day Saturdays', sessions: [
    ['2027-01-30', '9am–3pm'], ['2027-02-06', '9am–3pm'], 'Family Day Weekend — NO CLASS Feb 13', ['2027-02-20', '9am–3pm'], ['2027-02-27', '9am–3pm']
  ]},
  { code: 'W27-03C', label: 'March Break', type: '4 Day Consecutive', sessions: [
    ['2027-03-13', '10am–4pm'], ['2027-03-14', '10am–4pm'], ['2027-03-15', '10am–4pm'], ['2027-03-16', '10am–4pm']
  ]},
  { code: 'W27-04S', label: 'April', type: '4 Day Saturdays', sessions: [
    ['2027-04-03', '9am–3pm'], ['2027-04-10', '9am–3pm'], ['2027-04-17', '9am–3pm'], ['2027-04-24', '9am–3pm']
  ]},
  { code: 'W27-05S', label: 'May', type: '4 Day Saturdays', sessions: [
    ['2027-05-08', '9am–3pm'], ['2027-05-15', '9am–3pm'], 'Victoria Day Weekend — NO CLASS May 22', ['2027-05-29', '9am–3pm'], ['2027-06-05', '9am–3pm']
  ]}
];

const parseCourseDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const upcomingCourses = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return COURSES.filter(c => {
    const dates = c.sessions.filter(s => Array.isArray(s));
    return parseCourseDate(dates[dates.length - 1][0]) >= today;
  });
};

const escapeHtml = (s) => s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// Renders course cards into `container`. With selectable=true each card is a radio option.
const renderCourses = (container, selectable) => {
  const courses = upcomingCourses();
  if (!courses.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-gray-600);">New course dates are coming soon. Please call <a href="tel:4165511818" style="color:var(--color-navy);">416-551-1818</a>.</p>';
    return;
  }
  const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  container.innerHTML = courses.map(c => {
    const [prefix, suffix] = c.code.split('-');
    const dates = c.sessions.map(s => Array.isArray(s)
      ? `<span>${fmt.format(parseCourseDate(s[0]))} · ${s[1]}</span>`
      : `<span class="course-note">${escapeHtml(s)}</span>`).join('');
    const tag = selectable ? 'label' : 'div';
    const radio = selectable ? `<input type="radio" name="selected_course" value="${c.code}">` : '';
    return `<div class="course-month">
        <div class="course-month-label">${escapeHtml(c.label)}</div>
        <${tag} class="course-option">${radio}
          <div class="course-option-content">
            <div class="course-code">COURSE # ${prefix} - ${suffix}</div>
            <div class="course-type">${escapeHtml(c.type)}</div>
            <div class="course-dates">${dates}</div>
          </div>
        </${tag}>
      </div>`;
  }).join('');
};
