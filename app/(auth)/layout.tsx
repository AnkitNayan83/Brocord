const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex items-center justify-center bg-[rgb(0,120,255)]">
            {children}
        </div>
    );
};

export default AuthLayout;
