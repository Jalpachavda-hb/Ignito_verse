/**
 * Centralized Date Formatter Utility
 * Formats all application date strings and timestamps strictly into DD-MM-YYYY format.
 */

const MONTH_NAMES = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

/**
 * Formats a date into DD-MM-YYYY format.
 * Examples:
 *   "9/29/2026 12.44.28 PM" -> "29-09-2026"
 *   "06 October, 2026 12:08:50 PM" -> "06-10-2026"
 *   "2026-09-29T12:44:28" -> "29-09-2026"
 *   "August 14, 2026" -> "14-08-2026"
 *   "10 Sep 2026, 06:03 PM" -> "10-09-2026"
 *
 * @param {string|number|Date} input - Raw date string or timestamp
 * @param {string} [fallback=''] - Fallback value if empty or invalid
 * @returns {string} Formatted DD-MM-YYYY string
 */
export function formatDate(input, fallback = '') {
  if (!input && input !== 0) return fallback;
  const str = String(input).trim();
  if (!str) return fallback;

  // Preserve relative and non-date statuses
  if (/^(just now|recently|today|yesterday|completed|schedule tba|tba|scheduled)/i.test(str)) {
    return str;
  }

  // Already exact DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    return str;
  }

  // DD-MM-YYYY with trailing time or extra text
  const ddmmyyyyPrefixMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (ddmmyyyyPrefixMatch) {
    return `${ddmmyyyyPrefixMatch[1]}-${ddmmyyyyPrefixMatch[2]}-${ddmmyyyyPrefixMatch[3]}`;
  }

  // Slash formats: M/D/YYYY or MM/DD/YYYY or DD/MM/YYYY
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const [, p1, p2, year] = slashMatch;
    let day = p2;
    let month = p1;
    // If first number > 12, it must be DD/MM/YYYY
    if (Number(p1) > 12 && Number(p2) <= 12) {
      day = p1;
      month = p2;
    }
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  }

  // ISO / SQL format: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  }

  // Text date: "06 October, 2026" or "6 Oct 2026"
  const textMatch = str.match(/^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})/);
  if (textMatch) {
    const [, day, monthStr, year] = textMatch;
    const mNum = MONTH_NAMES[monthStr.toLowerCase()];
    if (mNum) {
      return `${String(day).padStart(2, '0')}-${String(mNum).padStart(2, '0')}-${year}`;
    }
  }

  // Text date: "October 06, 2026" or "August 14, 2026"
  const monthFirstMatch = str.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (monthFirstMatch) {
    const [, monthStr, day, year] = monthFirstMatch;
    const mNum = MONTH_NAMES[monthStr.toLowerCase()];
    if (mNum) {
      return `${String(day).padStart(2, '0')}-${String(mNum).padStart(2, '0')}-${year}`;
    }
  }

  // Standard Date parsing fallback with normalization for periods in time (e.g. 12.44.28 PM -> 12:44:28 PM)
  const normalized = str.replace(/(\d{1,2})\.(\d{2})\.(\d{2})/g, '$1:$2:$3');
  const d = new Date(normalized);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return str;
}

/**
 * Formats a date into DD-MM-YYYY with time (e.g. "29-09-2026, 12:44 PM")
 * @param {string|number|Date} input
 * @param {string} [fallback='']
 * @returns {string} Formatted DD-MM-YYYY with time
 */
export function formatDateTime(input, fallback = '') {
  if (!input && input !== 0) return fallback;
  const str = String(input).trim();
  if (!str) return fallback;

  if (/^(just now|recently|today|yesterday|completed|schedule tba|tba|scheduled)/i.test(str)) {
    return str;
  }

  const datePart = formatDate(str);
  if (!datePart) return fallback;

  // Extract time portion if present (support ISO T separator, space, AM/PM, seconds, etc.)
  const timeMatch = str.match(/(?:T|\s|^)(\d{1,2})[:.](\d{2})(?:[:.]\d{2})?(?:\.\d+)?\s*(AM|PM)?/i)
    || str.match(/(\d{1,2})[:.](\d{2})(?:[:.]\d{2})?\s*(AM|PM)?/i);

  if (timeMatch) {
    let [, hours, minutes, ampm] = timeMatch;
    if (ampm) {
      return `${datePart}, ${hours.padStart(2, '0')}:${minutes} ${ampm.toUpperCase()}`;
    }
    let h = parseInt(hours, 10);
    const ampmStr = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const formattedHours = String(h).padStart(2, '0');
    return `${datePart}, ${formattedHours}:${minutes} ${ampmStr}`;
  }

  return datePart;
}

export default formatDate;
