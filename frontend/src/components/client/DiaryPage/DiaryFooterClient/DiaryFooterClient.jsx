import React from 'react';
import './styles.css';
import ellipse from '../../../../images/icons/ellipse.svg';
import Button from '../../../psy/button/ButtonHeadline';
import { useFormContext } from 'react-hook-form';

export default function DiaryFooterClient({ diary }) {
  const [active, setActive] = React.useState(diary.visible);
  const { control, setValue, getValue } = useFormContext();

  React.useEffect(() => {
    setValue('visible', active);
  }, [active]);
  return (
    <div className="diary__footer">
      <div className="diary__footer-shared" onClick={(e) => e.stopPropagation()}>
        <div className="diary__footer-shared-text">Share with my therapist</div>
        <div
          className={`diary__footer-shared-toggle ${active ? 'active' : 'unactive'}`}
          onClick={() => {
            setActive((prev) => !prev);
          }}
        >
          <img src={ellipse} alt="toggle" className="icon__footer-toggle" />
        </div>
      </div>

      <div className="diary__footer-button-wrapper">
        <Button type="submit" className="diary__footer-button">
          SAVE
        </Button>
      </div>
    </div>
  );
}
