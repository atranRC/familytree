export function InviteTemplate({ treeName, invitationType, inviterName }) {
    let emailContent = `You have been invited to collaborate on ${treeName} by ${inviterName}`;
    if (invitationType !== "collab")
        emailContent = `You have been invited to join family tree - ${treeName} by ${inviterName}`;
    return (
        <div>
            <h1>Family Tree invitation</h1>
            <p>{emailContent}</p>
            <div>
                <a
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/u/invite-onboarding`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Click here
                </a>{" "}
                to continue
            </div>
        </div>
    );
}
