import { Messages } from './messages';
import { Answers } from './answers';
export class ChatUsersResponse {
    session_id ='';
    device_print ='';
    channel = '';
    ip_address = '';
    agent_name = '';
    user_location = ''
    user_url = '';
    tags = '';
    agent_ids = '';
    is_important = '';
    unread_messages_count = '';
    chat_name = '';
    is_closed = '';
    rating = '';
    feedback_message = '';
    is_resolved = '';
    notes ='';
    messages = new Array<Messages>();
    answers = new Array<Answers>();   
}
