import { merge } from 'lodash';
import Input from './Input';
// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return merge(
    Input(theme),
  );
}
