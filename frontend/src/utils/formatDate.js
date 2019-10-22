import { format, parseISO } from 'date-fns';

const DATE_FORMAT = 'dd. MM. yyyy';

export const formatDate = dateOrStringDate => {
  let parsedDate = dateOrStringDate;

  if (typeof dateOrStringDate === 'string') {
    parsedDate = parseISO(dateOrStringDate);
  }

  return format(parsedDate, DATE_FORMAT);
};
