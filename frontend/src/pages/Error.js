import { useRouteError } from 'react-router-dom'

import PageContent from 'components/error/PageContent.js'

function ErrorPage() {
    const error = useRouteError();
    let title = 'An error occured!';
    let message = 'Something weng wrong!';
    
    if (error.status === 401) {
        message = error.data.message;
    }

    if (error.status === 404) {
        title = 'Not found!';
        message = 'Could not find resource or page';
    }

    return (
        <>
        <PageContent title={title}>        
            <p>{message}</p>
            </PageContent>
        </>
    );
}

export default ErrorPage;