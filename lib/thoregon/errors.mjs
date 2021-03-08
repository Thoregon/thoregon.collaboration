/**
 *
 *
 * @author: blukassen
 */



import { EError}    from "/evolux.supervise";

export const ErrNotImplemented              = (msg)                 => new EError(`Not implemented: ${msg}`,                    "COLAB:00001");
export const ErrInvalidState                = (msg)                 => new EError(`Invalid state: ${msg}`,                      "COLAB:00002");
export const ErrNoId                        = (msg)                 => new EError(`Id missing: ${msg}`,                         "COLAB:00003");
export const ErrNotFound                    = (msg)                 => new EError(`Not found: ${msg}`,                          "COLAB:00003");
