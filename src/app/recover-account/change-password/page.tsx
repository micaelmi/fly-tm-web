import BackButton from "@/components/back-button";
import ChangePasswordForm from "@/modules/auth/change-password-form";

export default function ChangePassword() {
  return (
    <section>
      <div className="top-8 left-8 absolute">
        <BackButton />
      </div>
      <ChangePasswordForm />
    </section>
  );
}
