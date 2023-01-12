package net.bakseter.api.schema

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table

@Serializable
data class BaseWeightsJson(
    val dl: Float,
    val bp: Float,
    val sq: Float,
    val op: Float,
)

object BaseWeights : Table("base_weights") {
    val dl: Column<Float> = float("dl")
    val bp: Column<Float> = float("bp")
    val sq: Column<Float> = float("sq")
    val op: Column<Float> = float("op")

    override val primaryKey: PrimaryKey = PrimaryKey(dl, bp, sq, op)
}
