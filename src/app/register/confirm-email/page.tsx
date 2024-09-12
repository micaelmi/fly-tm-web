import BackButton from "@/components/back-button";
import ConfirmEmail from "@/modules/auth/confirm-email";

export default function ConfirmEmailPage() {
  return (
    <section className="flex justify-center items-center">
      <div className="top-8 left-8 absolute">
        <BackButton />
      </div>
      <ConfirmEmail />
    </section>
  );
}
