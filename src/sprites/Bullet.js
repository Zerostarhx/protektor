import Phaser from 'phaser'

export default class Bullet extends Phaser.Sprite {
  constructor (game, stats) {
    let center = { x: game.world.centerX, y: game.world.centerY }
    super(game, center.x, center.y, 'bullet')

    this._damage = stats.damage || 1
    this._health = stats.health || 1
    this._speed = stats.speed || 200
    this._direction = stats.direction
    this._type = stats.type || 'weapon'
    this.readyToDie = false
    
    this.game.stage.addChild(this)

    this.setupSprite()
    this.setupPhysics()
    this.setupCollisions()
  }

  setupSprite () {
    this.anchor.set(0.5)
    this.scale.setTo(2)
    this.events.onKilled.add(() => {
      this.destroy()
    }, this.game)
  }

  setupPhysics () {
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.game.physics.arcade.velocityFromAngle(this._direction, this._speed, this.body.velocity)
    this.outOfBoundsKill = true
    this.checkWorldBounds = true
  }

  /**
   * Damages enemies. Resets self to -4,-4. Sets flag to die.
   * Will die in update.
   **/
  setupCollisions () {
    this.body.onOverlap = new Phaser.Signal()
    this.body.onOverlap.add((me, other) => {
      other._type = other._type || ''

      if (other._type === 'enemy') {
        other.damage(me._damage)
        me.reset()
        me.readyToDie = true
      }
    }, this.game)
  }

  /**
   * Called in Stage's update function.
   **/
  update () {
    if (this.readyToDie) {
      this.kill()
    }
  }
}
