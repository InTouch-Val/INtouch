import React from 'react';
import './styles.css';
import Button from '../../../psy/button/ButtonHeadline';
import { useFormContext } from 'react-hook-form';

export default function DiaryFooterClient({ diary }) {
  const [active, setActive] = React.useState(diary ? diary.visible : false);
  const { control, setValue, getValue } = useFormContext();

  React.useEffect(() => {
    setValue('visible', active);
  }, [active]);
  return (
    <div className="diary__footer">
      <div className="diary__footer-shared" onClick={(e) => e.stopPropagation()}>
        <div className="diary__footer-shared-text">Share with my therapist</div>

        <input
          type="checkbox"
          className="footer__input-checkbox"
          defaultChecked={active}
          onClick={() => setActive((prev) => !prev)}
        />
      </div>

      <div className="diary__footer-button-wrapper">
        <Button type="submit" className="diary__footer-button">
          SAVE
        </Button>
      </div>
    </div>
  );
}
