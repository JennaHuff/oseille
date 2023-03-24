import { ScreenLayout } from '../../component/layout/ScreenLayout';
import { MyH1 } from '../../component/typography/MyFont';

export function Contact() {
  return (
    <ScreenLayout>
      <MyH1>Contact</MyH1>
      <p>Cette application est toujours en developpement.</p>
      <p>Si vous avez des questions ou des suggestions, appelez moi : 06 45 66 56 55</p>
    </ScreenLayout>
  );
}
