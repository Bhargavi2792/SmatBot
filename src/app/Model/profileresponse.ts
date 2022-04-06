import {customer_email_credential} from './customer_email_credential';
export class ProfileResponse {
    status: '' ;
    email: '';
    full_name: '';
    brand_name: '';
    phone_number: '';
    is_g2fa_enabled: ''; 
    url: '';
    customer_type:'';
    live_chat_whatsapp_notification: '';
    user_role:  '';
    agent_name: '';
    agent_id: '';
    agent_avatar:'';
    agent_status: '';
    is_livechat_enabled:'';
    customer_email_credential= new Array<customer_email_credential>();
    constructor(){}
}