class CommonMethodHelper {
  static addButton(scene, xCoord, yCoord, imgKey) {
    var button = scene.add.sprite(xCoord, yCoord, imgKey);
    return button;
  }

  static addImageButton(scene, xCoord, yCoord, imgKey, scale) {

    var button = scene.add.sprite(xCoord, yCoord, imgKey);
    button.setScale(scale,scale);
    return button;
  }

  static addContainer(scene, xCoord, yCoord, elements, xSize, ySize, useHandCursor = true) {

    var container = scene.add.container(xCoord, yCoord, elements).setSize(xSize, ySize).setInteractive({
      useHandCursor: useHandCursor,
    });
    return container;
  }
}

export default CommonMethodHelper;
