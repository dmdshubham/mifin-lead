const errorMap: Record<number, string> = {
  // Redirection
  300: "Multiple Choices: Multiple options.",
  301: "Moved Permanently: Resource moved.",
  302: "Found: Resource found elsewhere.",
  303: "See Other: See other resource.",
  304: "Not Modified: Not modified.",
  305: "Use Proxy: Use proxy.",
  306: "Switch Proxy: Switch proxy.",
  307: "Temporary Redirect: Temporary redirect.",
  308: "Permanent Redirect: Permanent redirect.",

  // Client Error
  400: "Bad Request: Invalid request.",
  401: "Unauthorized: You need to login first",
  402: "Payment Required: Payment needed.",
  403: "Forbidden: Access forbidden.",
  404: "Not Found: Resource not found.",
  405: "Method Not Allowed: Method not allowed.",
  406: "Not Acceptable: Unacceptable request.",
  407: "Proxy Authentication Required: Proxy auth needed.",
  408: "Request Timeout: Request timed out.",
  409: "Conflict: Conflict detected.",
  410: "Gone: Resource gone.",
  411: "Length Required: Length needed.",
  412: "Precondition Failed: Precondition failed.",
  413: "Payload Too Large: Payload too large.",
  414: "URI Too Long: URI too long.",
  415: "Unsupported Media Type: Media type unsupported.",
  416: "Range Not Satisfiable: Range not satisfiable.",
  417: "Expectation Failed: Expectation failed.",
  418: "I'm a teapot: Joke error.",
  421: "Misdirected Request: Wrong server.",
  422: "Unprocessable Entity: Unprocessable request.",
  423: "Locked: Resource locked.",
  424: "Failed Dependency: Dependency failed.",
  425: "Too Early: Too early.",
  426: "Upgrade Required: Upgrade needed.",
  428: "Precondition Required: Precondition needed.",
  429: "Too Many Requests: Too many requests.",
  431: "Request Header Fields Too Large: Headers too large.",
  451: "Unavailable For Legal Reasons: Legal block.",

  // Server Errors
  500: "Internal Server Error: Server error.",
  501: "Not Implemented: Not implemented.",
  502: "Bad Gateway: Bad gateway.",
  503: "Service Unavailable: Service unavailable.",
  504: "Gateway Timeout: Gateway timed out.",
  505: "HTTP Version Not Supported: HTTP version unsupported.",
  506: "Variant Also Negotiates: Negotiation error.",
  507: "Insufficient Storage: Insufficient storage.",
  508: "Loop Detected: Loop detected.",
  510: "Not Extended: Extension needed.",
  511: "Network Authentication Required: Network auth needed.",
};

const getErrorMessageWithErrorCode = (axiosError: any): string => {
  const errorMessage =
    errorMap[axiosError?.response?.status] ||
    axiosError?.message ||
    "Unexpected error occured.";
  console.error(errorMessage);
  return errorMessage;
};

export { getErrorMessageWithErrorCode };
