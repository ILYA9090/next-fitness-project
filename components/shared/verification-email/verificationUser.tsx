interface VerificationUserProps {
  className?: string;
  code: string;
}

export const VerificationUser = (props: VerificationUserProps) => {
  const { className, code } = props;

  return (
    <div className={className}>
      <p>
        Код подтверждения: <h2>{code}</h2>
      </p>
      <p>
        <a href={`http://localhost:3000/api/auth/verify?code=${code}`}>
          Подвердить регистрацию
        </a>
      </p>
    </div>
  );
};
