import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Paths {
    namespace AssistantsManagerCreateSession {
        export interface RequestBody {
            /**
             * username of the user creating the session
             */
            username: string;
        }
        namespace Responses {
            export interface $201 {
                /**
                 * session id
                 */
                session_id: string;
            }
            /**
             * example:
             * {
             *   "errors": [
             *     {
             *       "message": "You are not allowed to perform this action."
             *     }
             *   ]
             * }
             */
            export interface $403 {
                errors: {
                    message: string;
                }[];
            }
        }
    }
    namespace AssistantsManagerGetDisplayMessages {
        export interface RequestBody {
            /**
             * session id
             */
            session_id: string;
        }
        namespace Responses {
            export interface $201 {
                /**
                 * response from agent
                 */
                response: {
                    [key: string]: any;
                };
            }
            /**
             * example:
             * {
             *   "errors": [
             *     {
             *       "message": "You are not allowed to perform this action."
             *     }
             *   ]
             * }
             */
            export interface $403 {
                errors: {
                    message: string;
                }[];
            }
        }
    }
    namespace AssistantsManagerSendMessage {
        export interface RequestBody {
            /**
             * session id
             */
            session_id: string;
            /**
             * message to send
             */
            message: string;
        }
        namespace Responses {
            /**
             * example:
             * {
             *   "id": "msg_zijqYpetvYYU3jzQWpEVZ1Sx",
             *   "object": "thread.message",
             *   "created_at": 1700695753,
             *   "thread_id": "thread_GtMrBgiYDjxmy0Ha3tHIjN8e",
             *   "role": "user",
             *   "content": [
             *     {
             *       "type": "text",
             *       "text": {
             *         "value": "hola, listar el carpeta root",
             *         "annotations": []
             *       }
             *     }
             *   ],
             *   "file_ids": [],
             *   "assistant_id": null,
             *   "run_id": null,
             *   "metadata": {}
             * }
             */
            export interface $201 {
                /**
                 * example:
                 * msg_zijqYpetvYYU3jzQWpEVZ1Sx
                 */
                id: string;
                /**
                 * example:
                 * thread.message
                 */
                object: string;
                /**
                 * example:
                 * 1700695753
                 */
                created_at: number;
                /**
                 * example:
                 * thread_GtMrBgiYDjxmy0Ha3tHIjN8e
                 */
                thread_id: string;
                /**
                 * example:
                 * user
                 */
                role: string;
                /**
                 * example:
                 * [
                 *   {
                 *     "type": "text",
                 *     "text": {
                 *       "value": "hola, listar el carpeta root",
                 *       "annotations": []
                 *     }
                 *   }
                 * ]
                 */
                content: {
                    /**
                     * example:
                     * text
                     */
                    type: string;
                    /**
                     * example:
                     * {
                     *   "value": "hola, listar el carpeta root",
                     *   "annotations": []
                     * }
                     */
                    text: {
                        /**
                         * example:
                         * hola, listar el carpeta root
                         */
                        value: string;
                        /**
                         * example:
                         * []
                         */
                        annotations: null[];
                    };
                }[];
                /**
                 * example:
                 * []
                 */
                file_ids: null[];
                assistant_id: string | null;
                run_id: string | null;
                /**
                 * example:
                 * {}
                 */
                metadata: {
                    [key: string]: any;
                };
            }
            /**
             * example:
             * {
             *   "errors": [
             *     {
             *       "message": "You are not allowed to perform this action."
             *     }
             *   ]
             * }
             */
            export interface $403 {
                errors: {
                    message: string;
                }[];
            }
        }
    }
    namespace AssistantsManagerUpdateSession {
        export interface RequestBody {
            /**
             * session id
             */
            session_id: string;
        }
        namespace Responses {
            export interface $201 {
                /**
                 * response from agent
                 */
                response: {
                    [key: string]: any;
                };
            }
            /**
             * example:
             * {
             *   "errors": [
             *     {
             *       "message": "You are not allowed to perform this action."
             *     }
             *   ]
             * }
             */
            export interface $403 {
                errors: {
                    message: string;
                }[];
            }
        }
    }
    namespace DirectoryVisualization {
        export interface RequestBody {
            /**
             * Path to the directory to visualize
             */
            directoryPath: string;
            /**
             * Depth of the directory tree to visualize, default is 12
             */
            depth?: number;
            /**
             * Filter for directories, examples: '!.git', '!*modules', etc...
             */
            directoryFilter?: /* Filter for directories, examples: '!.git', '!*modules', etc... */ string | string[];
            /**
             * Filter for files, examples: '*.js', '*.txt', '*.md', etc...
             */
            fileFilter?: /* Filter for files, examples: '*.js', '*.txt', '*.md', etc... */ string | string[];
        }
        namespace Responses {
            export interface $201 {
                /**
                 * Textual or graphical representation of the directory structure
                 */
                result: string[];
            }
            /**
             * example:
             * {
             *   "errors": [
             *     {
             *       "message": "You are not allowed to perform this action."
             *     }
             *   ]
             * }
             */
            export interface $403 {
                errors: {
                    message: string;
                }[];
            }
        }
    }
    namespace FileContent {
        export interface RequestBody {
            /**
             * Path to the file to read
             */
            filePath: string;
        }
        namespace Responses {
            export interface $201 {
                /**
                 * Textual content of the file
                 */
                content: string;
            }
            /**
             * example:
             * {
             *   "errors": [
             *     {
             *       "message": "You are not allowed to perform this action."
             *     }
             *   ]
             * }
             */
            export interface $403 {
                errors: {
                    message: string;
                }[];
            }
        }
    }
}

export interface OperationMethods {
  /**
   * /directory_visualization - Visualize directory structure
   * 
   * Visualize directory structure
   */
  '/directory_visualization'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.DirectoryVisualization.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DirectoryVisualization.Responses.$201>
  /**
   * /file_content - Read file content
   * 
   * Read file content
   */
  '/file_content'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.FileContent.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FileContent.Responses.$201>
  /**
   * assistants_manager___get_display_messages - get display messages
   * 
   * get display messages
   */
  'assistants_manager___get_display_messages'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AssistantsManagerGetDisplayMessages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AssistantsManagerGetDisplayMessages.Responses.$201>
  /**
   * assistants_manager___create_session - create a session for the agent
   * 
   * create a session for the agent
   */
  'assistants_manager___create_session'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AssistantsManagerCreateSession.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AssistantsManagerCreateSession.Responses.$201>
  /**
   * assistants_manager___send_message - send message to agent
   * 
   * send message to agent
   */
  'assistants_manager___send_message'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AssistantsManagerSendMessage.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AssistantsManagerSendMessage.Responses.$201>
  /**
   * assistants_manager___update_session - update session
   * 
   * update session
   */
  'assistants_manager___update_session'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AssistantsManagerUpdateSession.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AssistantsManagerUpdateSession.Responses.$201>
}

export interface PathsDictionary {
  ['/directory_visualization']: {
    /**
     * /directory_visualization - Visualize directory structure
     * 
     * Visualize directory structure
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.DirectoryVisualization.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DirectoryVisualization.Responses.$201>
  }
  ['/file_content']: {
    /**
     * /file_content - Read file content
     * 
     * Read file content
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.FileContent.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FileContent.Responses.$201>
  }
  ['/assistants_manager/get_display_messages']: {
    /**
     * assistants_manager___get_display_messages - get display messages
     * 
     * get display messages
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AssistantsManagerGetDisplayMessages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AssistantsManagerGetDisplayMessages.Responses.$201>
  }
  ['/assistants_manager/create_session']: {
    /**
     * assistants_manager___create_session - create a session for the agent
     * 
     * create a session for the agent
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AssistantsManagerCreateSession.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AssistantsManagerCreateSession.Responses.$201>
  }
  ['/assistants_manager/send_message']: {
    /**
     * assistants_manager___send_message - send message to agent
     * 
     * send message to agent
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AssistantsManagerSendMessage.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AssistantsManagerSendMessage.Responses.$201>
  }
  ['/assistants_manager/update_session']: {
    /**
     * assistants_manager___update_session - update session
     * 
     * update session
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AssistantsManagerUpdateSession.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AssistantsManagerUpdateSession.Responses.$201>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
