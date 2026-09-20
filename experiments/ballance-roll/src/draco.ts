import { useGLTF } from '@react-three/drei';

/** Vendored three/examples/jsm/libs/draco/gltf decoder. No gstatic fetch. */
export const DRACO_DECODER_PATH = '/draco/';

useGLTF.setDecoderPath(DRACO_DECODER_PATH);
