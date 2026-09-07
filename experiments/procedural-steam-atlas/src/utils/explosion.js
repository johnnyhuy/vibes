export function explodeParts(locomotive, explosionFactor) {
  const allParts = [
    ...locomotive.parts.chassis,
    ...locomotive.parts.wheels,
  ];

  allParts.forEach((part) => {
    const original = part.userData.originalPosition;
    const explosionVec = part.userData.explosionVector;

    if (original && explosionVec) {
      part.position.x = original.x + explosionVec.x * explosionFactor;
      part.position.y = original.y + explosionVec.y * explosionFactor;
      part.position.z = original.z + explosionVec.z * explosionFactor;
    }
  });
}
